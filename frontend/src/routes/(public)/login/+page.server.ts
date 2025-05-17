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
	login: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const result = loginSchema.safeParse(formData);

		if (!result.success) {
			const { fieldErrors } = result.error.flatten();

			return {
				action: 'login',
				success: false,
				data: formData,
				errors: fieldErrors
			};
		}

		console.log('✅ Datos válidos login:', result.data);

		// Guardar en DB, crear sesión, etc.

		throw redirect(303, '/home');
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
