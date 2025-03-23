<script setup lang="ts">
const { data: posts } = await useAsyncData(
	"blog",
	() => queryCollection("blog")
		.order("date", "DESC")
		.all(),
);

useSeoMeta({
	title: "blog | lumi's trashcan",
	ogTitle: "blog | lumi's trashcan",
	description: "This is my amazing site, let me tell you all about it.",
	ogDescription: "This is my amazing site, let me tell you all about it.",
});
</script>

<template>
	<div>
		<h1>blog</h1>

		<hr>

		<p>sometimes i write stuff. not that i'm a particularly good writer, but i like ranting and being autistic about things i like (or dislike).</p>

		<hr>

		<ul>
			<li
				v-for="post in posts"
				:key="post.id">
				<NuxtLink :to="post.path">
					{{ post.title }}
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>
