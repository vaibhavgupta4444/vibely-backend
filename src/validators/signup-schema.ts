import { z } from 'zod'
import { passwordSchema } from './password-schema';

export const signupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email('Invalid email address'),
    password: passwordSchema
});