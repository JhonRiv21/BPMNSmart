import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchWithAuthFromServer } from '$lib/server/fetchWithAuth';

export const PUT: RequestHandler = async (event) => {
  const { id } = event.params;

  let requestBodyFromClient;
  try {
    requestBodyFromClient = await event.request.json();
  } catch (e: any) {
    return json(
      { error: 'Cuerpo de la petición inválido o no es JSON.', details: e.message },
      { status: 400 }
    );
  }

  if (!id) {
    return json({ error: 'ID de proceso no proporcionado en la URL.' }, { status: 400 });
  }

  try {
    const resultFromApiCall = await fetchWithAuthFromServer(
      event,
      `/api/process/historical/${id}`,
      'PUT',
      requestBodyFromClient
    );

    return json(resultFromApiCall.data, { status: resultFromApiCall.status });
  } catch (error: any) {
    return json(
      { error: 'Error inesperado en el servidor proxy.', details: error.message },
      { status: 500 }
    );
  }
};
