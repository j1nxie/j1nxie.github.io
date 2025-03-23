<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
	error: Object as ()=> NuxtError,
});

useSeoMeta({
	title: "oops! | lumi's trashcan",
	ogTitle: "oops! | lumi's trashcan",
	description: "This is my amazing site, let me tell you all about it.",
	ogDescription: "This is my amazing site, let me tell you all about it.",
});
</script>

<template>
	<div>
		<Header />

		<h1>{{ error.statusCode }}</h1>

		<hr>

		<p>the requested page could not be found.</p>

		<p>are you sure you're at the right place? the wrong person in the right place can make all the changes in the world.</p>

		<NuxtLink to="/">
			go back?
		</NuxtLink>

		<Footer />
	</div>
</template>
