# Forms

All forms **MUST** use React Hook Form (`useForm`) combined with a Zod schema (`zodResolver`). No manual `useState` validation, no uncontrolled inputs, no inline error strings.

## Table of Contents

- [Schema Definition](#schema-definition)
- [Form Initialisation](#form-initialisation)
- [Controlled Inputs](#controlled-inputs)
- [Displaying Errors](#displaying-errors)
- [Submission](#submission)
- [Examples](#examples)

---

## Schema Definition

Define the Zod schema at **module level** — outside the component — so it is not re-created on every render. Derive the TypeScript type with `z.infer`.

```typescript
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
```

- ✅ Schema defined outside the component
- ❌ Schema defined inside the component body — recreated on each render

---

## Form Initialisation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: '',
        password: '',
    },
    mode: 'onSubmit', // default — errors appear after first submit attempt
});
```

**`mode` options:**

| Mode                   | When to use                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `'onSubmit'` (default) | Most forms — errors shown after first submit                                  |
| `'onChange'`           | Only when live feedback is explicitly required (e.g. password-strength meter) |
| `'onBlur'`             | When errors should appear as the user leaves each field                       |

---

## Controlled Inputs

Native HTML inputs (`<input>`, `<textarea>`) work directly with `form.register`:

```typescript
<Input {...form.register('email')} />
```

Non-native inputs — shadcn `Switch`, `Select`, `RadioGroup`, `Checkbox`, etc. — do not emit a native `onChange(event)` and **MUST** be wrapped with `<Controller>`:

```typescript
// ✅ Good: Controller for non-native input
import { Controller } from 'react-hook-form';

<Controller
    control={form.control}
    name='isAvailable'
    render={({ field }) => (
        <Switch checked={field.value} onCheckedChange={field.onChange} />
    )}
/>

// ❌ Bad: direct register on a non-native input
<Switch {...form.register('isAvailable')} />
```

---

## Displaying Errors

Use `<FieldError>` from `@/uis/field` — never render inline `<span>` or `<p>` elements for field errors.

```typescript
import { FieldError } from '@/uis/field';

<Input
    {...form.register('email')}
    aria-invalid={!!form.formState.errors.email}
/>
{form.formState.errors.email && (
    <FieldError>{form.formState.errors.email.message}</FieldError>
)}
```

- ✅ `<FieldError>` for consistent error styling across all forms
- ❌ `<p className="text-red-500">{error}</p>` — inconsistent, bypasses the design system

---

## Submission

Wire the `<form>` tag to `form.handleSubmit`. The callback receives fully validated, typed values — no manual validation is needed inside it.

```typescript
const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
        // values is typed and already validated by Zod
        await loginMutation.mutateAsync(values);
    },
    [loginMutation.mutateAsync],
);

return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* fields */}
        <Button type='submit' disabled={loginMutation.isPending}>
            Sign in
        </Button>
    </form>
);
```

- ✅ `form.handleSubmit(handler)` — Zod validates before the handler runs
- ❌ Manual `if (!email) setError(...)` inside the submit handler — duplicates Zod

---

## Examples

### Full login form

```typescript
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/uis/button';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => void;
    isPending: boolean;
}

function LoginForm({ onSubmit, isPending }: LoginFormProps) {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                    type='email'
                    {...form.register('email')}
                    aria-invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email && (
                    <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
            </Field>

            <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                    type='password'
                    {...form.register('password')}
                    aria-invalid={!!form.formState.errors.password}
                />
                {form.formState.errors.password && (
                    <FieldError>{form.formState.errors.password.message}</FieldError>
                )}
            </Field>

            <Button type='submit' disabled={isPending}>
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
        </form>
    );
}

export default memo(LoginForm);
```
