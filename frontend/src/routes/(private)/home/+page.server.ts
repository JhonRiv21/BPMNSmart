import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { sanitizeString } from '$lib/utils/utils';

const nameDiagram = z.object({
	nameCreate: z
		.string()
		.trim()
		.min(2, { message: 'Mínimo 2 caracteres' })
		.max(50, { message: 'Máximo 50 caracteres' })
		.transform(sanitizeString)
});
export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');

	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/process`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) throw new Error('Error fetching processes');

		const data = await res.json();

		return {
			processes: data
		};
	} catch (err) {
		console.error('Failed to fetch processes', err);
		return {
			processes: []
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const name = formData.get('nameDiagram')?.toString();

		const validationResult = nameDiagram.safeParse({ nameCreate: name });
		const validatedName = validationResult.data?.nameCreate;

		if (!token) {
			return fail(401, {
				error: 'Token no proporcionado o inválido.',
				values: { nameCreate: validatedName }
			});
		}

		if (!validationResult.success) {
			const errors = validationResult.error.flatten().fieldErrors;
			return fail(400, {
				errors,
				values: { nameCreate: name }
			});
		}

		let created;

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/process/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					name: validatedName,
					bpmnXml: '',
					screenShot: ''
				})
			});

			if (!res.ok) {
				let errorToReturnToClient = 'Error al crear el diagrama, intente más tarde.';
				try {
					const errorBody = await res.json();
					if (errorBody?.error === 'Ya tienes un proceso con ese nombre.') {
						errorToReturnToClient = errorBody.error;
					}
				} catch (e) {
					console.error('No se pudo leer el error JSON de la API o la respuesta no era JSON:', e);
				}

				return fail(res.status, {
					error: errorToReturnToClient,
					values: { nameCreate: validatedName }
				});
			}

			console.log('res', res);
			created = await res.json();
		} catch (err) {
			console.error('Excepción de red o fetch al intentar crear el proceso:', err);
			return fail(500, {
				error:
					'No se pudo conectar con el servidor para crear el diagrama. Verifique su conexión e intente más tarde.',
				values: { nameCreate: validatedName }
			});
		}

		throw redirect(303, `/bpmn/${created.data.id}`);
	},

	delete: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const id = formData.get('idDelete');
		console.log('Delete action formData:', Object.fromEntries(formData));

		if (!id || !token) {
			return { success: false, error: 'Faltan datos' };
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/process/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id })
			});

			if (!res.ok) {
				throw new Error('Error al eliminar proceso');
			}
			return { success: true, message: 'Diagrama eliminado con éxito' };
		} catch (err) {
			console.error('Failed to delete process', err);
			return { success: false, error: 'No se pudo eliminar diagrama, intente más tarde' };
		}
	}
};
