import { URL_BACKEND } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: `${URL_BACKEND}/auth/google`
		}
	});
};
