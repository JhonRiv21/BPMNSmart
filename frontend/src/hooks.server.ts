import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

const PUBLIC_ROUTES = ['/', '/login', '/demo'];

export const handle: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  console.log(`[HOOKS] Path: ${path}`);

  if (path.startsWith('/.well-known/appspecific/com.chrome.devtools.json')) {
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  }

  const token = event.cookies.get('token');
  console.log(`[HOOKS] Token from cookie ('${event.url.hostname}'): ${token ? 'FOUND' : 'NOT FOUND'}`);

  if (token) {
    try {
      if (!JWT_SECRET) {
        console.error('[HOOKS] JWT_SECRET is not configured on the SvelteKit server.');
        throw new Error('JWT_SECRET is not configured on the server.');
      }
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; };
      event.locals.user = decoded;
      event.locals.token = token;
      console.log('[HOOKS] Token verified. User:', event.locals.user);
    } catch (err: any) {
      console.error('[HOOKS] Token verification failed:', err.message);
      event.locals.user = undefined;
      event.locals.token = undefined;
      // Borrar cookie inválida para evitar reintentos
      // event.cookies.delete('token', { path: '/' });
    }
  } else {
    event.locals.user = undefined;
    event.locals.token = undefined;
  }

 	const originalFetch = event.fetch;
	event.fetch = (info, init?) => {
		const modifiedInit = { ...(init || {}) };
		if (event.locals.token) {
			modifiedInit.headers = {
				...(modifiedInit.headers || {}),
				Authorization: `Bearer ${event.locals.token}`
			};
		}
		return originalFetch(info, modifiedInit);
	};

  const isLoggedIn = !!event.locals.user?.id;
  console.log(`[HOOKS] isLoggedIn: ${isLoggedIn}`);

  const isPublic = PUBLIC_ROUTES.some((publicRoute) => {
    if (publicRoute === '/') return path === '/';
    return path === publicRoute || path.startsWith(publicRoute + '/');
  });
  console.log(`[HOOKS] isPublic: ${isPublic}`);

  if (!isPublic && !isLoggedIn) {
    console.log(`[HOOKS] Redirecting to /login (Path: ${path} is not public and user not logged in)`);
    throw redirect(303, '/login');
  }

  if (isLoggedIn && (path === '/login' || path === '/' || path === '/demo')) {
    console.log(`[HOOKS] Redirecting to /home (User logged in and path is ${path})`);
    throw redirect(303, '/home');
  }

  console.log(`[HOOKS] Resolving event for path: ${path}`);
  return resolve(event);
};