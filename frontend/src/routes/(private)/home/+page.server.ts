import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod'

const sanitizeString = (str: string) => str.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ\-_]/g, '');

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

    const result = nameDiagram.safeParse({ nameCreate: name });

    console.log('Create action formData:', Object.fromEntries(formData));
    if (!token) {
      return { success: false, error: 'Token no proporcionado' };
    }

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return fail(400, {
        success: false,
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
          name: result.data.nameCreate,
          bpmnXml: '',
          screenShot: ''
        })
      })

      if (!res.ok) {
        throw new Error('Error al crear proceso');
      }
      console.log('res', res)
      created = await res.json();
    } catch (err) {
      console.error('Failed to create process', err);
      return { success: false, error: 'Error en el servidor' };
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
      return { success: true };
    } catch (err) {
      console.error('Failed to delete process', err);
      return { success: false, error: 'Error en el servidor' };
    }
  }
};