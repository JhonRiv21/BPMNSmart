import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchWithAuthFromServer } from '$lib/server/fetchWithAuth';

export const GET: RequestHandler = async (event) => {
  const { id } = event.params;
  console.log(`[PROXY_GET] /api/proxy/process/${id}: Request received. ID: "${id}"`);

  if (!id) {
    console.error(`[PROXY_GET] Error - ID de proceso no proporcionado.`);
    return json({ error: 'ID de proceso no proporcionado en la URL.' }, { status: 400 });
  }
  
  try {
    const resultFromApiCall = await fetchWithAuthFromServer(
      event,
      `/api/process/${id}`,
      'GET'
    );

    console.log(`[PROXY_GET] /api/proxy/process/${id}: Result from fetchWithAuthFromServer: Status ${resultFromApiCall.status}`);

    return json(resultFromApiCall.data, { status: resultFromApiCall.status });

  } catch (error: any) {
    console.error(`[PROXY_GET] Unexpected error in GET proxy handler for ID ${id}:`, error);
    return json({ error: 'Error inesperado en el servidor proxy al obtener datos.', details: error.message }, { status: 500 });
  }
};