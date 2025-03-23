<script setup lang="ts">
import { OtogeStats } from "#components";

useSeoMeta({
	title: "rhythm games | lumi's trashcan",
	ogTitle: "rhythm games | lumi's trashcan",
});
</script>

<template>
	<div>
		<h1>rhythm games</h1>

		<hr>

		<h2>what are these?</h2>
		<p>
			i've unfortunately spent a <b>ton</b> of time playing these games called 音ゲー (<abbr
				style="font-size: 85%"
				title="literal translation">lit.</abbr> 'sound game', more commonly referred to as rhythm games), starting from the year 2019 with <NuxtLink to="https://osu.ppy.sh">
					osu!
				</NuxtLink> as my first ever.
		</p>
		<p>
			slowly, i discovered mobile rhythm games, namely <NuxtLink to="https://en.wikipedia.org/wiki/Love_Live!_School_Idol_Festival">
				Love Live! School Idol Festival
			</NuxtLink> and i'm deep down the rabbit hole from there.
		</p>
		<p>
			nowadays, i play arcade rhythm games, mainly ones from SEGA's GekiChuMai series, with CHUNITHM and maimaiでらっくす being my main titles, as well as my most active community.
		</p>

		<hr>

		<h2>stats</h2>
		<p>alongside being a rhythm game enthusiast, i'm also very interested in my statistics and progression for said games!</p>
		<p>
			data powered by the amazing <NuxtLink to="https://github.com/zkrising/Tachi">
				Kamaitachi
			</NuxtLink>.
		</p>

		<OtogeStats />

		<p>still a massive wip. come back later?</p>
	</div>
</template>

<style scoped>
a {
    display: inline-block;
}
</style>
