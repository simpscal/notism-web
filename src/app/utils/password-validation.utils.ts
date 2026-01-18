import { z } from 'zod';

/**
 * Password validation schema
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special symbol
 */
export const passwordSchema = z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special symbol' });
