import { PUBLIC_API_URL } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

export async function fetchWithAuthFromServer(
	event: RequestEvent,
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	data?: any
) {
	const token = event.cookies.get('token');

	if (!token) {
		return {
			ok: false,
			status: 401,
			data: { error: 'Acceso no autorizado desde el servidor proxy (token no encontrado).' }
		};
	}

	const apiUrl = `${PUBLIC_API_URL}${endpoint}`;

	try {
		const responseFromApi = await fetch(apiUrl, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data ? JSON.stringify(data) : undefined
		});

		const responseBodyText = await responseFromApi.text();
		let parsedResultData;

		try {
			if (responseBodyText) {
				parsedResultData = JSON.parse(responseBodyText);
			} else {
				parsedResultData = responseFromApi.ok
					? {}
					: { error: 'Respuesta vacía de la API con error de status.' };
			}
		} catch {
			return {
				ok: false,
				status: responseFromApi.ok ? 502 : responseFromApi.status,
				data: {
					error: responseFromApi.ok
						? 'Respuesta inesperada de la API (no es JSON pero status OK).'
						: 'La API devolvió un error no JSON.',
					rawResponse: responseBodyText
				}
			};
		}

		return {
			ok: responseFromApi.ok,
			status: responseFromApi.status,
			data: parsedResultData
		};
	} catch (error: any) {
		return {
			ok: false,
			status: 503,
			data: {
				error: 'Error de red o excepción al contactar la API externa.',
				details: error.message
			}
		};
	}
}
