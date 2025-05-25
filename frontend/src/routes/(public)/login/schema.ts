import { z } from 'zod';

const emailSchema = z
  .string({ required_error: 'Campo requerido' })
  .min(3, { message: 'Mínimo 3 caracteres' })
  .max(50, { message: 'Máximo 50 caracteres' })
  .regex(/[^@\s]+@[^@\s]+\.[^@\s]+/, { message: 'Email inválido' })
  .trim();

const passwordSchema = z
  .string({ required_error: 'Campo requerido' })
  .min(5, { message: 'Mínimo 5 dígitos' })
  .max(50, { message: 'Máximo 50 dígitos' })
  .trim();


export const loginSchema = z.object({
  emailLogin: emailSchema,
  passwordLogin: passwordSchema
});

export const createAccountSchema = z.object({
  emailCreate: emailSchema,
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
  passwordCreate: passwordSchema,
    confirmPasswordCreate: passwordSchema
  })
  .refine((data) => data.passwordCreate === data.confirmPasswordCreate, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPasswordCreate']
  });