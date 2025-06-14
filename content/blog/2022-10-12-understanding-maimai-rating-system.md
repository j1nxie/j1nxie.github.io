+++
title = "Understanding maimaiでらっくす's Rating System"

[taxonomies]
tags = ["rhythm games"]
+++

_(Update 01/12/2022: As pointed out by [Amasugi](https://twitter.com/meyyosu),
maimai でらっくす's ranking doesn't have the E-F ranks anymore, instead replaced
by BB and BBB. I've updated the table below to reflect that!)_

_(Update 26/02/2024: Updated a few things because I know more about the game
now!)_

I have been playing maimai でらっくす for ~~a couple of months~~ a while now,
and personally, I am very intrigued by the internal workings of the game. After
working on [Tachi](https://github.com/TNG-dev/Tachi)'s maimai でらっくす
implementation, I started learning about the game's internal rating system. This
post will focus on exactly that, from the very bottom up.

## What is this "Rating" you're talking about?

Let's start by understanding "rating". In maimai でらっくす, for every
difficulty of a song (hereby referred to as "chart") played, there will be an
integer rating associated to it, depending on multiple factors. Each account
will have a _total rating_, usually used as a metric to gauge progress and skill
level. This total rating number can _only increase_, not decrease, as higher
scored and harder charts gets played on that account. For each total rating
range, there will be also a colored plate representing that range. In the
community, it is referred to as below:

| Color    | Total rating range |
| -------- | ------------------ |
| White    | 0-999              |
| Blue     | 1000-1999          |
| Green    | 2000-3999          |
| Yellow   | 4000-6999          |
| Red      | 7000-9999          |
| Purple   | 10000-11999        |
| Bronze   | 12000-12999        |
| Silver   | 13000-13999        |
| Gold     | 14000-14499        |
| Platinum | 14500-14999        |
| Rainbow  | 15000+             |

## So, how is this "rating" calculated?

We can start with the easier one out of everything: _total rating_. An account's
total rating is made up of two parts, New Charts' ratings, and Old Charts'
ratings. These ratings only accomodate for the best records on that account, and
will not change if you achieve a downscore on the same chart.

**New Charts**

-   New Charts are charts that are added in the latest title version (i.e.
    Universe, Universe Plus, etc.)
-   The top 15 ratings are listed here.

**Old Charts**

-   Old Charts are charts that are added in previous title versions.
-   The top 35 ratings are listed here.

The formula for total rating is given below:

$$\text{Total Rating} = S_N + S_B$$

-   $S_N$ is the sum of all Ratings in New Charts.
-   $S_B$ is the sum of all Ratings in Old Charts.

With that out of the way, we can now get into how each chart's rating is
calculated. _Chart ratings_ are calculated with the formula given below:

$$\text{Chart Rating} = \lfloor\text{Chart Constant} \times \text{Score} \times
\text{Rank Multiplier}\rfloor$$

This formula shows that there are three relevant quantities when it comes to
calculating the Chart Rating. Each of the sections below will proceed to explain
each of them.

### Chart Constant

In the game, each chart is assigned an **integer** difficulty level, ranging
from 1-15. Between level 7-15, there are also intermediate levels, with a plus
added to them to better distinguish charts' difficulties (e.g. 7+, 8+, 9+,
etc.).

If you looked at this, you would assume that all charts of the same difficulty
level are actually of the same difficulty. This is a false assumption, as
internally, each chart is assigned a **decimal** level for them. Given a
difficulty level $X$, its internal level will range between $X.0$ to $X.6$,
while $X+$ will range from $X.7$ to $X.9$.

These values are usually derived from the rating changes observed when finishing
a chart ingame, using the above formula, but finding for $\text{Chart
Constant}$. For those who has access to the game files, this is also defined in
the chart's XML file as well.

### Score

This is just the score you obtained, converted to a decimal. So, for example,
100% will have a value of 1, and 101% will have a value of 1.01. With maimai で
らっくす's system, score will always have a maximum value of 101%, whereas
maimai FiNALE scores will have a maximum value depending on the amount of BREAK
notes found in the chart.

This writeup will not go deep into how scores in both games are calculated, as
it is not the focus of what we are discussing.

Another thing to note is all scores above 100.5% will be treated as 100.5%, so
the rating algorithm essentially caps out at 100.5% if you are aiming to
maximize rating for your scores.

### Rank Multiplier

For maimai でらっくす, SEGA has opted for a rank-based multiplier, instead of a
more linear multiplier like in CHUNITHM. This means your rating will increase
with each rank, while small score increments will usually not result in a rating
increase.

| Rank | Multiplier |
| ---- | ---------- |
| SSS+ | 22.4       |
| SSS  | 21.6       |
| SS+  | 21.1       |
| SS   | 20.8       |
| S+   | 20.3       |
| S    | 20         |
| AAA  | 16.8       |
| AA   | 15.2       |
| A    | 13.6       |
| BBB  | 12         |
| BB   | 11.2       |
| B    | 9.6        |
| C    | 8          |
| D    | 5          |

## Conclusions

With all three main parts of the formula and the total rating explained, I feel
like this is enough for a wrap-up. For now, this should be everything that is
needed to understand and work with maimai でらっくす's rating system.
