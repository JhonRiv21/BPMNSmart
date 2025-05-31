// /lib/server/fetchWithAuth.ts
import { PUBLIC_API_URL } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

export async function fetchWithAuthFromServer(
  event: RequestEvent,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any
) {
  console.log(`[PROXY_LOG] fetchWithAuthFromServer: Initiating request. Endpoint: ${endpoint}, Method: ${method}`);
  
  const token = event.cookies.get('token');
  // LOG 1: Verificar el token
  console.log(`[PROXY_LOG] fetchWithAuthFromServer: Token from cookies: "${token ? 'TokenPresent' : 'TokenUndefinedOrEmpty'}"`);
  // Para depuración más profunda, podrías loguear el token si no es muy sensible para tus logs de desarrollo:
  // console.log(`[PROXY_LOG] fetchWithAuthFromServer: Token value: ${token}`);


  if (!token) {
    console.error('[PROXY_LOG] fetchWithAuthFromServer: Error - Token not found in cookies.');
    return {
      ok: false,
      status: 401, // Unauthorized
      data: { error: 'Acceso no autorizado desde el servidor proxy (token no encontrado).' }
    };
  }

  // LOG 2: Verificar la variable de entorno y la URL final
  console.log(`[PROXY_LOG] fetchWithAuthFromServer: PUBLIC_API_URL value: "${PUBLIC_API_URL}"`);
  const apiUrl = `${PUBLIC_API_URL}${endpoint}`;
  console.log(`[PROXY_LOG] fetchWithAuthFromServer: Attempting to fetch from API URL: ${apiUrl}`);
  if (data) {
    console.log('[PROXY_LOG] fetchWithAuthFromServer: Request body to be sent:', JSON.stringify(data, null, 2));
  }


  try {
    const responseFromApi = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: data ? JSON.stringify(data) : undefined
    });

    // LOG 3: Status de la respuesta de la API externa
    console.log(`[PROXY_LOG] fetchWithAuthFromServer: Response from API [${apiUrl}]. Status: ${responseFromApi.status} ${responseFromApi.statusText}`);

    const responseBodyText = await responseFromApi.text();
    // LOG 4: Cuerpo de la respuesta de la API externa (como texto)
    console.log(`[PROXY_LOG] fetchWithAuthFromServer: Response body (text) from API [${apiUrl}]:\n---\n${responseBodyText}\n---`);

    let parsedResultData;
    try {
      if (responseBodyText) {
        parsedResultData = JSON.parse(responseBodyText);
      } else {
        // Si el cuerpo está vacío, pero la respuesta fue OK (ej. 204 No Content), es válido.
        parsedResultData = responseFromApi.ok ? {} : { error: 'Respuesta vacía de la API con error de status.' };
      }
    } catch (e) {
      console.error(`[PROXY_LOG] fetchWithAuthFromServer: Failed to parse API response as JSON for [${apiUrl}]. Error:`, e);
      // Si la respuesta original no fue OK, y además no es JSON, retornamos un error más genérico.
      // Si fue OK pero no es JSON, es un problema de contrato con la API.
      return {
        ok: false, 
        status: responseFromApi.ok ? 502 : responseFromApi.status, // 502 Bad Gateway si la API OK pero respuesta malformada
        data: { 
          error: responseFromApi.ok ? 'Respuesta inesperada de la API (no es JSON pero status OK).' : 'La API devolvió un error no JSON.', 
          rawResponse: responseBodyText 
        }
      };
    }

    return {
      ok: responseFromApi.ok,
      status: responseFromApi.status,
      data: parsedResultData
    };

  } catch (error: any) { // Especificar 'any' o 'unknown' y luego castear si es necesario
    // LOG 5: Error de red o excepción en el fetch
    console.error(`[PROXY_LOG] fetchWithAuthFromServer: Network error or exception during fetch to [${apiUrl}]:`, error);
    return {
      ok: false,
      status: 503, // Service Unavailable (o 500 Internal Server Error)
      data: { error: 'Error de red o excepción al contactar la API externa.', details: error.message }
    };
  }
}