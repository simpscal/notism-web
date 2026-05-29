import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/form';
import { Input } from '@/components/input';

function FormDemo() {
    const { t } = useTranslation();

    const formSchema = z.object({
        username: z.string().min(2, { message: t('storybook.form.usernameMin') }),
        email: z.string().email({ message: t('storybook.form.emailInvalid') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('storybook.form.username')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('storybook.form.usernamePlaceholder')} {...field} />
                            </FormControl>
                            <FormDescription>{t('storybook.form.usernamePlaceholderDescription')}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('storybook.form.email')}</FormLabel>
                            <FormControl>
                                <Input type='email' placeholder={t('storybook.form.emailPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>{t('storybook.form.submit')}</Button>
            </form>
        </Form>
    );
}

const meta = {
    title: 'Components/Inputs/Form',
    component: FormDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
