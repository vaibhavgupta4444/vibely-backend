import { z } from 'zod'
import { passwordSchema } from './password-schema';

export const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
});