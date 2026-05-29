import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';

const meta = {
    title: 'Components/Inputs/Field',
    component: Field,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ width: '320px' }}>
            <FieldGroup>
                <Field>
                    <FieldLabel>Email address</FieldLabel>
                    <Input type='email' placeholder='you@example.com' />
                    <FieldDescription>We will never share your email.</FieldDescription>
                </Field>
            </FieldGroup>
        </div>
    ),
};

export const WithError: Story = {
    render: () => (
        <div style={{ width: '320px' }}>
            <FieldGroup>
                <Field>
                    <FieldLabel>Email address</FieldLabel>
                    <Input type='email' placeholder='you@example.com' aria-invalid />
                    <FieldError errors={[{ message: 'Invalid email address' }]} />
                </Field>
            </FieldGroup>
        </div>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <div style={{ width: '400px' }}>
            <FieldGroup>
                <Field orientation='horizontal'>
                    <FieldLabel>Username</FieldLabel>
                    <Input placeholder='johndoe' />
                </Field>
            </FieldGroup>
        </div>
    ),
};
