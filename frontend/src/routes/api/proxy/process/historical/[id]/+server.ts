import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchWithAuthFromServer } from '$lib/server/fetchWithAuth';

export const GET: RequestHandler = async (event) => {
	const { id } = event.params;

	if (!id) {
		console.error(`[PROXY_GET] Error - ID de proceso no proporcionado.`);
		return json({ error: 'ID de proceso no proporcionado en la URL.' }, { status: 400 });
	}

	try {
		const resultFromApiCall = await fetchWithAuthFromServer(
			event,
			`/api/process/historical/${id}`,
			'GET'
		);

		return json(resultFromApiCall.data, { status: resultFromApiCall.status });
	} catch (error: any) {
		return json(
			{ error: 'Error inesperado en el servidor proxy al obtener datos.', details: error.message },
			{ status: 500 }
		);
	}
};
