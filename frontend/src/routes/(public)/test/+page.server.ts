import type { Actions } from '@sveltejs/kit';
import { z, ZodError } from 'zod';

const registerSchema = z.object({
  username: z
    .string({ required_error: 'Campo requerido' })
    .min(3, { message: 'Mínimo 3 letras' })
    .regex(/^[a-zA-Z]+$/, { message: 'Solo letras' })
    .max(50, { message: 'Máximo 50 caracteres' })
    .trim(),
  age: z
    .string({ required_error: 'Campo requerido' })
    .regex(/^[0-9]+$/, { message: 'Solo números' })
    .min(2, { message: 'Mínimo 2 caracteres' })
    .max(50, { message: 'Máximo 50 caracteres' })
    .trim()
});

export const actions: Actions = {
  default: async ({ request }) => {
    const rawFormData = await request.formData();
    const formData = Object.fromEntries(rawFormData);

    try {
      const result = registerSchema.parse(formData);
      console.log('✅ Datos válidos:', result);

      // Aquí puedes procesar el formulario: guardar en DB, redirigir, etc.
      return {
        success: true,
        data: result
      };
    } catch (err) {
      if (err instanceof ZodError) {
        const { fieldErrors } = err.flatten();

        return {
          success: false,
          data: formData,
          errors: fieldErrors
        };
      }

      // Manejo de errores inesperados
      console.error('❌ Error inesperado en acción:', err);
      return {
        success: false,
        data: formData,
        errors: {
          general: ['Ocurrió un error inesperado. Intenta de nuevo.']
        }
      };
    }
  }
};
