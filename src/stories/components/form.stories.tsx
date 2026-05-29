import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/form';
import { Input } from '@/components/input';

const formSchema = z.object({
    username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
});

function FormDemo() {
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
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder='johndoe' {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type='email' placeholder='you@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Submit</Button>
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
