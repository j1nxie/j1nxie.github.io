<script setup lang="ts">
const { path } = useRoute();

const { data: article, error } = await useAsyncData(
	`blog-post-${path}`,
	() => queryCollection("blog")
		.path(path)
		.first(),
);

if (error.value) {
	await navigateTo("/404.html");
}
</script>

<template>
	<div>
		<h1>
			{{ article.title }}
		</h1>
		<h3>
			<NuxtTime
				:datetime="article.date"
				month="long"
				day="numeric"
				weekday="long"
				year="numeric" />
		</h3>

		<hr>

		<ContentRenderer
			:value="article"
			:prose="true" />
	</div>
</template>
