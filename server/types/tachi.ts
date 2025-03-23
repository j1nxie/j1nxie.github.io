export interface TachiResponse<T = Record<string, unknown>> {
	success: boolean;
	description: string;
	body: T;
}
