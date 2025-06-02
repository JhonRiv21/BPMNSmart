import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, SUPPORT_EMAIL } from '$env/static/private';

export const POST: RequestHandler = async ({ request, cookies, fetch, url }) => {
	const token = cookies.get('token');
	if (!token) {
		return new Response(JSON.stringify({ success: false, error: 'No autenticado' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let email: string;
	try {
		const payload = jwt.verify(token, JWT_SECRET) as { email: string };
		email = payload.email;
		if (!email) throw new Error();
	} catch {
		return new Response(JSON.stringify({ success: false, error: 'Token inválido o expirado' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let message: string;
	try {
		const formData = await request.formData();
		const rawMessage = formData.get('message');
		if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim() === '') {
			throw new Error();
		}
		message = rawMessage.trim();
	} catch {
		return new Response(JSON.stringify({ success: false, error: 'Mensaje inválido' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const forwardForm = new FormData();
	forwardForm.append('email', email);
	forwardForm.append('message', message);
	forwardForm.append('_subject', 'Solicitud de soporte (SSR)');
	forwardForm.append('_captcha', 'false');

	try {
		const res = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
			method: 'POST',
			body: forwardForm,
			headers: {
				Accept: 'application/json',
				Origin: url.origin,
				Referer: url.href,
				'User-Agent': 'SSR Handler'
			}
		});

		const text = await res.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Respuesta inválida del servidor externo',
					details: text
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		if (!res.ok || String(data.success).toLowerCase() === 'false') {
			return new Response(
				JSON.stringify({
					success: false,
					error: data.message || 'Error en FormSubmit',
					details: data
				}),
				{
					status: res.ok ? 400 : res.status,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		return new Response(
			JSON.stringify({ success: true, message: 'Mensaje enviado correctamente.', data }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (err: any) {
		return new Response(
			JSON.stringify({
				success: false,
				error: 'Error al conectar con FormSubmit',
				details: err.message
			}),
			{
				status: 503,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
