// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/demo',
];

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
				id: string;
				email: string;
			};

			event.locals.user = decoded;
			event.locals.token = token;
		} catch (err) {
			event.locals.user = undefined;
      event.locals.token = undefined;
		}
	} else {
		event.locals.user = undefined;
    event.locals.token = undefined;
	}

	event.fetch = async (info, init = {}) => {
		if (event.locals.token) {
			init.headers = {
				...(init.headers || {}),
				Authorization: `Bearer ${event.locals.token}`,
			};
		}
		return fetch(info, init);
	};

  const isLoggedIn = !!event.locals.user;
  const isPublic = PUBLIC_ROUTES.includes(event.url.pathname);

  if (!isPublic && !isLoggedIn) {
    throw redirect(302, '/login');
  }

  if (isLoggedIn && isPublic) {
    throw redirect(302, '/home');
  }

	return resolve(event);
};
