import { PUBLIC_API_URL } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const loginSchema = z.object({
	emailLogin: z
		.string({ required_error: 'Campo requerido' })
		.min(3, { message: 'Mínimo 3 caracteres' })
		.max(50, { message: 'Máximo 50 caracteres' })
		.regex(/[^@\s]+@[^@\s]+\.[^@\s]+/, { message: 'Email inválido' })
		.trim(),
	passwordLogin: z
		.string({ required_error: 'Campo requerido' })
		.min(3, { message: 'Mínimo 3 dígitos' })
		.max(50, { message: 'Máximo 50 dígitos' })
		.trim()
});

const createAccountSchema = z.object({
	emailCreate: z
		.string({ required_error: 'Campo requerido' })
		.min(3, { message: 'Mínimo 3 caracteres' })
		.max(50, { message: 'Máximo 50 caracteres' })
		.regex(/[^@\s]+@[^@\s]+\.[^@\s]+/, { message: 'Email inválido' })
		.trim(),
	nameCreate: z
		.string({ required_error: 'Campo requerido' })
		.min(2, { message: 'Mínimo 2 caracteres' })
		.max(50, { message: 'Máximo 50 caracteres' })
		.trim(),
	lastNameCreate: z
		.string({ required_error: 'Campo requerido' })
		.min(2, { message: 'Mínimo 2 caracteres' })
		.max(50, { message: 'Máximo 50 caracteres' })
		.trim(),
	passwordCreate: z
		.string({ required_error: 'Campo requerido' })
		.min(5, { message: 'Mínimo 5 dígitos' })
		.max(50, { message: 'Máximo 50 dígitos' })
		.trim()
});

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = loginSchema.safeParse(formData);

		if (!result.success) {
			const { fieldErrors } = result.error.flatten();
			const { passwordLogin, ...restData } = formData;
			return {
				action: 'login',
				success: false,
				data: restData,
				errors: fieldErrors
			};
		}

		const { emailLogin, passwordLogin } = result.data;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/users/auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: emailLogin, password: passwordLogin })
			});

			if (!res.ok) {
				const error = await res.json();
				const { passwordLogin, ...restData } = formData;
				return {
					action: 'login',
					success: false,
					data: restData,
					errors: { passwordLogin: [error.message || 'Credenciales inválidas'] }
				}	
			}

			const { token }: { token: string } = await res.json();

			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			});
		
			throw redirect(303, '/home');
		} catch (err) {
			const { passwordLogin, ...restData } = formData;
			return {
				action: 'login',
				success: false,
				data: restData,
				errors: { passwordLogin: ['Error en el servidor. Intenta más tarde.'] }
			};
		}
	},





	create: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = createAccountSchema.safeParse(formData);

		if (!result.success) {
			const { fieldErrors } = result.error.flatten();

			return {
				action: 'create',
				success: false,
				data: formData,
				errors: fieldErrors
			};
		}

		console.log('✅ Datos válidos creación:', result.data);

		// Guardar en DB, crear sesión, etc.

		throw redirect(303, '/home');
	}
};
