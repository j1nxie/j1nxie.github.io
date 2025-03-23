<script setup lang="ts">
const { data: chuni } = await useFetch("/api/chunithm");
</script>

<template>
	<table>
		<thead>
			<tr>
				<th>game</th>
				<th>stats</th>
				<th>other notes</th>
			</tr>
		</thead>

		<tbody>
			<tr>
				<td>
					CHUNITHM
				</td>
				<td>
					- b50 rating: <span class="stats">{{ chuni.body.gameStats.ratings.naiveRating }}</span>
					<br>
				</td>
				<td />
			</tr>
		</tbody>
	</table>
</template>

<style scoped>
table {
    width: 100%;
}

table,
th,
td {
    border: 1px solid;
    border-collapse: collapse;
}

td {
    padding: 5px;
}

.stats {
    padding: 2px;
    background-color: grey;
    border-radius: 8px;
}
</style>
