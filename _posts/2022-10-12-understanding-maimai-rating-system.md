---
title: "Understanding maimaiでらっくす's Rating System"
date: 2022-10-12 19:00:00 +0700
layout: post
categories: [blogs, english]
tags: [rhythm games]
---

*(Update 01/12/2022: As pointed out by [Amasugi](https://twitter.com/meyyosu),
maimaiでらっくす's ranking doesn't have the E-F ranks anymore, instead replaced
by BB and BBB. I've updated the table below to reflect that!)*

I have been playing maimaiでらっくす for a couple of months now, and personally,
I am very intrigued by the internal workings of the game. Sadly, I am not very
knowledgeable in terms of arcade hardware, software and networking myself. But,
after working on [Tachi](https://github.com/TNG-dev/Tachi)'s ~~sadly still
in-progress~~ maimaiでらっくす implementation, I started learning about the
game's internal rating system. This post will focus on exactly that, from the
very bottom up.

## What is this "Rating" you're talking about?

Let's start by understanding "rating". In maimaiでらっくす, for every difficulty
of a song (hereby referred to as "chart") played, there will be an integer rating
associated to it, depending on multiple factors. Each account will have a
*total rating*, usually used as a metric to gauge progress and skill level. This
total rating number can *only increase*, not decrease, as higher scored and harder
charts gets played on that account. For each total rating range, there will be
also a colored plate representing that range. In the community, it is referred
to as below:

Color  | Total rating range
------ | ------------------
White  | 0-999
Blue   | 1000-1999
Green  | 2000-3999
Yellow | 4000-6999
Red    | 7000-9999
Purple | 10000-11999
Bronze | 12000-12999
Silver | 13000-13999
Gold   | 14000-14499
Platinum | 14500-14999
Rainbow  | 15000+

## So, how is this "rating" calculated?

We can start with the easier one out of everything: *total rating*. An account's
total rating is made up of two parts, New Charts' ratings, and Old Charts'
ratings. These ratings only accomodate for the best records on that account, and
will not change if you achieve a downscore on the same chart.

**New Charts**

- New Charts are charts that are added in the latest title version (i.e.
Universe, Universe Plus, etc.)
- The top 15 ratings are listed here.

**Old Charts**

- Old Charts are charts that are added in previous title versions.
- The top 35 ratings are listed here.

The formula for total rating is given below:

$$\text{Total Rating} = S_N + S_B$$

- $S_N$ is the sum of all Ratings in New Charts.
- $S_B$ is the sum of all Ratings in Old Charts.

With that out of the way, we can now get into how each chart's rating is
calculated. *Chart ratings* are calculated with the formula given below:

$$\text{Chart Rating} = \lfloor\text{Chart Constant} \times \text{Score} \times \text{Rank Multiplier}\rfloor$$

This formula shows that there are three relevant quantities when it comes to
calculating the Chart Rating. Each of the sections below will proceed to explain
each of them.

### Chart Constant

In the game, each chart is assigned an **integer** difficulty level, ranging
from 1-15. Between level 7-15, there are also intermediate levels, with a plus
added to them to better distinguish charts' difficulties (e.g. 7+, 8+, 9+,
etc.).

If you looked at this, you would assume that all charts of the same
difficulty level are actually of the same difficulty. This is a false
assumption, as internally, each chart is assigned a **decimal** level for them.
Given a difficulty level $X$, its internal level will range between $X.0$ to $X.6$,
while $X+$ will range from $X.7$ to $X.9$.

These values are either derived from the ratings obtained from the game itself,
using the exact above formula, but finding for $\text{Chart Constant}$ instead
of $\text{Chart Rating}$, or found inside the game files. I do not have a very
well understanding the game files itself so I will not comment much on
this matter.

### Score

This is just the score you obtained, converted to a decimal. So, for example,
100% will have a value of 1, and 101% will have a value of 1.01. By
maimaiでらっくす's system, score will always have a maximum value of 101%,
whereas maimai FiNALE scores will have a maximum value depending on the amount
of BREAK notes found in the chart.

This writeup will not go deep into how scores in both games are calculated, so
this will end here.

Another thing to note is all scores above 100.5% will be treated as 100.5%, so
the rating algorithm essentially caps out at 100.5% if you are aiming to
maximize rating for your scores.

### Rank Multiplier

For some unknown reasons, internally, there are also multipliers associated with
every ranking found in the game. There are 12 ranks, ranging from F to SSS+, and
with each rank, there is a multiplier associated with it. This table below shows
the multiplier for each rank:

Rank | Multiplier
---- | ----------
SSS+ | 22.4
SSS  | 21.6
SS+  | 21.1
SS   | 20.8
S+   | 20.3
S    | 20
AAA  | 16.8
AA   | 15.2
A    | 13.6
BBB  | 12
BB   | 11.2
B    | 9.6
C    | 8
D    | 5

## Conclusions

With all three main parts of the formula and the total rating explained, I feel
like this is enough for a wrap-up. For now, this should be everything that is
needed to understand and work with maimaiでらっくす's rating system.

For maimai FiNALE's rating system, the only thing I really understand about it
is it has a decimal rating (similar to CHUNITHM's rating and Arcaea's
Potential), and it can also increase or decrease depending on your score.
