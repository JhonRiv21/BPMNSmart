import { PUBLIC_API_URL } from '$env/static/public';
import { redirect, type Actions } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type z from 'zod';
import { loginSchema, createAccountSchema } from './schema';

type FormErrors<T> = Partial<Record<keyof T, string[]>>;
type LoginData = z.infer<typeof loginSchema>;
type CreateAccountData = z.infer<typeof createAccountSchema>;

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const result = loginSchema.safeParse(formData);

		if (!result.success) {
			const { fieldErrors } = result.error.flatten();
			const { passwordLogin, ...restData } = formData;
			void passwordLogin;
			return {
				action: 'login',
				success: false,
				data: restData,
				errors: fieldErrors as FormErrors<LoginData>
			};
		}

		const { emailLogin, passwordLogin } = result.data;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/users/auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: emailLogin, password: passwordLogin })
			});

			const data = await res.json();

			if (!res.ok) {
				const apiErrors: FormErrors<LoginData> = {
            passwordLogin: [data.error || 'Credenciales inválidas']
        };
				const { passwordLogin, ...restData } = formData;
				void passwordLogin;
				return {
					action: 'login',
					success: false,
					data: restData,
					errors: apiErrors
				};
			}
			console.log('LOGIN RESPONSE:', data);

			if (!data?.token || !data?.user) {
				const unexpectedErrors: FormErrors<LoginData> = {
            passwordLogin: ['Error inesperado en el login']
        };
				const { passwordLogin, ...restData } = formData;
				void passwordLogin;
				return {
					action: 'login',
					success: false,
					data: restData,
					errors: unexpectedErrors
				};
			}

			cookies.set('token', data.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: 60 * 60 * 24
			});
		} catch (err) {
			console.error('LOGIN ERROR:', err);
			const { passwordLogin, ...restData } = formData;
			const catchErrors: FormErrors<LoginData> = {
        passwordLogin: ['Error en el servidor. Intenta más tarde.']
      };
			void passwordLogin;
			return {
				action: 'login',
				success: false,
				data: restData,
				errors: catchErrors
			};
		}
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
				errors: fieldErrors as FormErrors<CreateAccountData>
			};
		}

		const { 
			emailCreate, 
			nameCreate, 
			lastNameCreate, 
			passwordCreate, 
		} = result.data;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/users/create`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: emailCreate,
					name: nameCreate,
					lastName: lastNameCreate,
					password: passwordCreate
				})
			})

			const data = await res.json();

			 if (!res.ok) {
        const apiErrors: FormErrors<CreateAccountData> = {};
        const errorMessage = data.error || 'Error al crear cuenta.';
        apiErrors.passwordCreate = [errorMessage];
        apiErrors.confirmPasswordCreate = [errorMessage]; 
				const { passwordCreate, confirmPasswordCreate, ...restData } = formData;
				void confirmPasswordCreate
        return {
          action: 'create' as const,
          success: false,
          data: restData,
          errors: apiErrors
        };
      }
		} catch (err) {
			console.error('CREATION ERROR:', err);
			const catchErrors: FormErrors<CreateAccountData> = {
        passwordCreate: ['Error en el servidor. Intenta más tarde.'],
      };
			const { passwordCreate, confirmPasswordCreate, ...restData } = formData;
			void confirmPasswordCreate
			return {
        action: 'create' as const,
        success: false,
        data: restData,
        errors: catchErrors
      };
		}

		throw redirect(303, '/home');
	}
};
