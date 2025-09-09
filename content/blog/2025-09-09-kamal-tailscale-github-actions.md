+++
title = "TIL: Automatically deploy your projects using Kamal, Tailscale and GitHub Actions"
description = "Writing a Discord bot sure comes with its own inconveniences: actually deploying it and keeping it running. Thankfully, we do have some very convenient tools on hand that would help us with this issue."

[taxonomies]
tags = ["coding", "infrastructure", "automation"]
+++

I got myself writing a new Discord bot again, this time, named after the rat
Thiren with that rizz from Zenless Zone Zero, [Jane Doe](https://github.com/j1nxie/jane-doe).
What does it do? Well, seeing that a lot of people are posting images from the
various imageboards like Gelbooru and Danbooru, there's bound to be plenty of AI
art or AI-assisted art. Disallowing people posting art from certain artists is
still rather difficult due to the sheer amount of people just... not being able
to read, ignorance, mistakes, so on and so forth. It's a lot of work for
moderators to actually scan through and spot these images, and it looks like a
very automatable thing because we _have_ a list of disallowed artists, thus,
Jane Doe was born! It uses `dhash`[^1] to compare posted images with a database
of known images, scraped off of imageboards.

I'll talk more about Jane Doe in another blog post in the near future (maybe)
(if I ever get around to writing one) (I swear), what we're going to look at
today is how I built the infrastructure to deploy it to my servers securely.

# Introducing Kamal

[Kamal](https://kamal-deploy.org/) is a neat little tool that wraps around
Docker and SSH to quickly deploy web apps to various servers from your own
machine. By default, running `kamal deploy` in a Kamal-initialized repository
will trigger a build using the Dockerfile within the repository, then it will
proceed to deploy said build to servers that you've defined within the config file.

Kamal also comes with the ability to define "accessories". These are
long-running services that are required by your app, such as databases,
similar to things you would define in your Docker Compose file. Running
`kamal accessory boot` will spin up new accessory services on the defined hosts.

# Introducing Tailscale

[Tailscale](https://tailscale.com/) is a VPN service that allows connecting your
devices securely under networks called "tailnets". This is what I will use to
connect to my machines without the need to expose their IPs and port 22 to the
public Internet.

# Introducing GitHub Actions

...really now, you wouldn't need this to be introduced, would you?

Fiiiiiiiine, I'll tell you about it anyways. [GitHub Actions](https://github.com/features/actions)
is GitHub's own CI/CD[^2] platform, for automating software development
workflows. You can define triggers to automatically run test suites, Docker
builds, so on. We'll use this to automatically build our Discord bot and deploy
a build through Kamal.

Anyways, with our major players introduced out of the way, let's get started
with how this works.

# Initializing and configuring Kamal

We'll start with initializing Kamal within the repository. You'll need
`config/kamal.yml`, which can be quickly created using `kamal init`. Mine is
below, nicely annotated:

```yml
# the service name, this will be important later!
service: jane-doe
# the image used for the service
image: j1nxie/jane-doe

servers:
  web:
    # list of hosts to deploy the project on
    hosts:
      - <%= ENV['TAILSCALE_HOST'] %>
    # disable the built-in Kamal proxy as we do not need it for a Discord bot!
    proxy: false

registry:
  # authenticate through GitHub's container registry
  server: ghcr.io
  username: j1nxie

  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - DATABASE_URL
    - DISCORD_TOKEN
    - POSTGRES_PASSWORD
    # other secrets here

builder:
  arch: amd64
  args:
    GIT_SHA: <%= `git rev-parse HEAD`.strip %>

boot:
  # limit 1 max instance online for Discord bots
  limit: 1

accessories:
  # define a Postgres database for the Discord bot to use
  postgres:
    image: postgres:17
    host: <%= ENV['TAILSCALE_HOST'] %>
    port: 5432
    env:
      clear:
        POSTGRES_DB: janedoe_prod
      secret:
        - POSTGRES_PASSWORD
    volumes:
      - /var/lib/postgresql/data:/var/lib/postgresql/data
```

The ERB template strings are there to directly pull environment variables
defined within the GitHub Action workflow, similar to how you could access
context variables in the workflow YAML files.

Alongside it, we also need a `.kamal/secrets` file to load
[secrets](https://kamal-deploy.org/docs/configuration/environment-variables/)
into the container during deployment:

```sh
# the password used to authenticate with the container registry, in this case,
# a GitHub classic personal access token.
KAMAL_REGISTRY_PASSWORD=$KAMAL_REGISTRY_PASSWORD

DISCORD_TOKEN=$DISCORD_TOKEN
DATABASE_URL=$DATABASE_URL
# other secrets here
```

# Setting up the workflow itself alongside Tailscale

```yml
# other sections omitted for brevity

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/j1nxie/jane-doe

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          build-args: |
            GIT_SHA=${{ github.sha }}
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.2"
          bundler-cache: true

      - name: Install Kamal
        run: gem install kamal

      - name: Tailscale
        uses: tailscale/github-action@v3
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
          tags: tag:ci

      - name: Setup SSH Agent
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy with Kamal
        env:
          VERSION: main
          KAMAL_REGISTRY_PASSWORD: ${{ secrets.GITHUB_TOKEN }}

          DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
          # other environment variables here

          TAILSCALE_HOST: ${{ secrets.TAILSCALE_HOST }}
        run: kamal deploy --skip-push
```

Woah, that's one hella long workflow file. My build job is nothing too
complicated, just the usual `docker/build-push-action` setup to get an image up
into GHCR. The main interesting part is in the `deploy` job, let's see how it works.

Well, I sort of lied, the first half of installing Ruby into the environment,
setting up Kamal, setting up Tailscale using the
[official guide](https://tailscale.com/kb/1276/tailscale-github-action),
nothing too interesting.

I use [`webfactory/ssh-agent`](https://github.com/webfactory/ssh-agent)
to insert a SSH private key into the GitHub Action worker node, as my server
has password authentication disabled.

> This setup doesn't work right out of the box, you'll need to do a bit of
> bootstrapping! Create a new SSH keypair on your server and add it to the `root`
> user's authorized keys:
>
> ```sh
> sudo cat ~/.ssh/id_ed25519.pub > /root/.ssh/authorized_keys
> ```
>
> This will make sure that Kamal is able to SSH into the server and deploy the
> Discord bot!

Then, at the final step, we'll pull in all the environment variables to load
into Kamal as secrets, and run Kamal with the `--skip-push` argument, as we've
already built the image during the previous step and cached it.

The `VERSION` environment is very important also, as the workflow will push the
image on the `main` tag, whereas Kamal by default pushes and expects a version
tag as the Git commit hash!

> Of course, remember to actually add in the secrets to your GitHub repository!
> I used the `gh` CLI utility to add them to my repository, through the command:
>
> ```sh
> gh secret set SECRET_NAME
> ```

With this setup, you'll need to add a `service` LABEL to the resulting Docker
image, as Kamal expects this label to know which container to spin down during
deployment of new versions.

```diff
FROM beerpsi/cargo-chef-musl-mimalloc:latest AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json

ARG GIT_SHA=unknown
ENV VERGEN_GIT_SHA=$GIT_SHA

COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM gcr.io/distroless/static AS runtime
+LABEL service="jane-doe"
WORKDIR /app
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/jane-doe /app/
CMD ["/app/jane-doe", "start"]
```

# Conclusion

With this, we've completed a whole CI/CD workflow that does all the annoying
parts of running a project: _actually deploying it_. Say goodbye to the annoying
days of manually SSHing into a server, pulling new code, restarting the Compose
stack, or in my case, logging into a Portainer instance that's behind a
Tailscale tailnet that I cannot access conveniently at work to deploy my projects.

Of course, there's still plenty I could improve to fine-tune the deployment
experience, but for now, I think this is one hell of a good job for like, 4
hours of figuring out off of documentations!

[^1]:
    A differential gradient hash that compares the difference in gradient
    between adjacent pixels, and provides a 64-bit signature of an image.

[^2]: Continuous integration and continuous delivery.
