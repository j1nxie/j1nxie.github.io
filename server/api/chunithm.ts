export default defineEventHandler(async () => {
	const config = useRuntimeConfig();

	const response = await $fetch(
		`${config.kamaitachiApiUrl}/users/679/games/chunithm/Single`,
		{
			headers: {
				Authorization: `Bearer ${config.kamaitachiApiKey}`,
			},
		});

	return response;
});
