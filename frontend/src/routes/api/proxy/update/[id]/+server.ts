// /routes/api/proxy/update/[id]/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchWithAuthFromServer } from '$lib/server/fetchWithAuth';

export const PUT: RequestHandler = async (event) => {
  const { id } = event.params;
  // LOG 6: Inicio del handler del proxy
  console.log(`[PROXY_LOG] PUT /api/proxy/update/${id}: Request received. ID from params: "${id}"`);

  let requestBodyFromClient;
  try {
    requestBodyFromClient = await event.request.json();
    // LOG 7: Cuerpo de la petición del cliente
    console.log(`[PROXY_LOG] PUT /api/proxy/update/${id}: Request body from client parsed:`, JSON.stringify(requestBodyFromClient, null, 2));
  } catch (e: any) {
    console.error(`[PROXY_LOG] PUT /api/proxy/update/${id}: Failed to parse request body from client as JSON:`, e);
    return json({ error: 'Cuerpo de la petición inválido o no es JSON.', details: e.message }, { status: 400 });
  }

  if (!id) {
    console.error(`[PROXY_LOG] PUT /api/proxy/update/${id}: Error - ID de proceso no proporcionado en la ruta.`);
    return json({ error: 'ID de proceso no proporcionado en la URL.' }, { status: 400 });
  }
  
  try {
    const resultFromApiCall = await fetchWithAuthFromServer(
      event,
      `/api/process/${id}`, // Este es el endpoint de TU API EXTERNA
      'PUT',
      requestBodyFromClient
    );

    // LOG 8: Resultado obtenido de fetchWithAuthFromServer
    console.log(`[PROXY_LOG] PUT /api/proxy/update/${id}: Result from fetchWithAuthFromServer:`, JSON.stringify(resultFromApiCall, null, 2));

    // Devolver la respuesta al cliente, usando el status y data de la llamada a la API
    return json(resultFromApiCall.data, { status: resultFromApiCall.status });

  } catch (error: any) { // Este catch es una salvaguarda extra
    console.error(`[PROXY_LOG] PUT /api/proxy/update/${id}: Unexpected error in proxy handler (outer try-catch):`, error);
    return json({ error: 'Error inesperado en el servidor proxy.', details: error.message }, { status: 500 });
  }
};