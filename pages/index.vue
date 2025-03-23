<script setup lang="ts">
useSeoMeta({
	title: "lumi's trashcan",
	ogTitle: "lumi's trashcan",
	description: "This is my amazing site, let me tell you all about it.",
	ogDescription: "This is my amazing site, let me tell you all about it.",
});
</script>

<template>
	<TwemojiParse>
		<h1>home</h1>

		<hr>

		<h2>who, me?</h2>
		<NuxtImg src="/assets/suiseistupid.png" />
		<p>i'm a weebcore developer on the internet, as well as a part-time hoshiyomi ☄.</p>
		<p>i mainly write Discord bots, backend stuff, scrapers and random things i'm interested in, with a little bit of infrastructure going along with it.</p>
		<p>i also want to dabble in digital art too. i play a ton of rhythm games, JRPGs and shooters. currently, i mainly spend my time playing CHUNITHM and hanging around in those circles.</p>

		<hr>

		<h2>socials</h2>
		<p>outside of this very website, you can probably find me in other places. some i do care to touch are:</p>
		<div id="socials">
			<NuxtLink
				to="https://anilist.co/user/Lumi9"
				class="social-entry">
				<Icon
					size="1.5rem"
					name="i-simple-icons-anilist" />
				<span>Lumi9</span>
			</NuxtLink>
			<div class="social-entry">
				<Icon
					size="1.5rem"
					name="i-fa6-brands-discord" />
				<span>_lumi9</span>
			</div>
		</div>
		<p>i'm also available under other aliases, and probably a lot more places than you'd think.</p>

		<hr>

		<blockquote>
			<p>"I want to do what I can for the people who need me. That way, I might remain in the memories of that person, right?"</p>
			— Chisato Nishikigi
		</blockquote>
	</TwemojiParse>
</template>

<style scoped>
#socials {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.social-entry {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.social-entry > span {
    font-size: 0.9rem;
}
</style>
