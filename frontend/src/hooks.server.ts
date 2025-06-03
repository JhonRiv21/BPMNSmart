import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

const PUBLIC_ROUTES = ['/', '/demo'];

export const handle: Handle = async ({ event, resolve }) => {
	console.log('All cookies:', event.cookies);
	const token = event.cookies.get('token');
	console.log('Token cookie:', event.cookies.get('token'));
	const path = event.url.pathname;

	if (path.startsWith('/.well-known/appspecific/com.chrome.devtools.json')) {
		return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
	}

	if (token) {
		try {
			if (!JWT_SECRET) {
				throw new Error('JWT_SECRET is not configured on the server.');
			}
			const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
			event.locals.user = decoded;
			event.locals.token = token;
		} catch {
			event.locals.user = undefined;
			event.locals.token = undefined;
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

	const isPublic = PUBLIC_ROUTES.some((publicRoute) => {
		if (publicRoute === '/') return path === '/';
		return path === publicRoute || path.startsWith(publicRoute + '/');
	});

	if (!isPublic && !isLoggedIn) {
		throw redirect(303, '/');
	}

	if (isLoggedIn && (path === '/' || path === '/demo')) {
		throw redirect(303, '/home');
	}

	return resolve(event);
};
