import { URL_BACKEND } from "$env/static/private";

let awakenPromise: Promise<Response> | null = null;

export const GET = async () => {
	if (!awakenPromise) {
		awakenPromise = fetch(`${URL_BACKEND}/health`);
	}

	const res = await awakenPromise
		.then((r) => (r.ok ? r : Promise.reject(r)))
		.catch((err) => {
			console.error('❌ Backend no respondió:', err);
			return new Response('fail', { status: 502 });
		});

	return new Response('ok', { status: res.ok ? 200 : 502 });
};
