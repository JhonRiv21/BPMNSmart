import type { Actions } from '@sveltejs/kit';
import { z, ZodError } from 'zod'

const loginSchema = z.object({

})

export const actions: Actions = {
  login: async ({ request }) => {
    const formData = await Object.fromEntries(await request.formData());
  } 
};