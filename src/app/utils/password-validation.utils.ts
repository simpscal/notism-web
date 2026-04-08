import i18next from 'i18next';
import { z } from 'zod';

/**
 * Password validation schema factory
 * Creates a password validation schema with i18n support
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special symbol
 */
export const createPasswordSchema = () =>
    z
        .string()
        .min(1, { message: i18next.t('auth.validation.passwordRequired') })
        .min(8, { message: i18next.t('auth.validation.passwordMinLength') })
        .regex(/[A-Z]/, { message: i18next.t('auth.validation.passwordUppercase') })
        .regex(/[0-9]/, { message: i18next.t('auth.validation.passwordNumber') })
        .regex(/[^A-Za-z0-9]/, { message: i18next.t('auth.validation.passwordSpecialChar') });
