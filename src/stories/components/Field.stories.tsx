import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@/components/checkbox';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/field';
import { Input } from '@/components/input';

const meta = {
    title: 'Components/Field',
    component: Field,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Field className='max-w-sm'>
            <FieldLabel htmlFor='field-default'>Full name</FieldLabel>
            <Input id='field-default' placeholder='Jane Doe' />
        </Field>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <Field className='max-w-sm'>
            <FieldLabel htmlFor='field-desc'>Username</FieldLabel>
            <Input id='field-desc' placeholder='@handle' />
            <FieldDescription>This is your public display name visible to other members.</FieldDescription>
        </Field>
    ),
};

export const WithError: Story = {
    render: () => (
        <Field data-invalid='true' className='max-w-sm'>
            <FieldLabel htmlFor='field-err'>Email</FieldLabel>
            <Input id='field-err' type='email' aria-invalid defaultValue='bad-email' />
            <FieldError>Please enter a valid email address.</FieldError>
        </Field>
    ),
};

export const WithDescriptionAndError: Story = {
    render: () => (
        <Field data-invalid='true' className='max-w-sm'>
            <FieldLabel htmlFor='field-full'>Password</FieldLabel>
            <Input id='field-full' type='password' aria-invalid defaultValue='123' />
            <FieldDescription>Must be at least 8 characters with a number and special character.</FieldDescription>
            <FieldError>Password is too short.</FieldError>
        </Field>
    ),
};

export const HorizontalOrientation: Story = {
    render: () => (
        <FieldGroup className='max-w-md'>
            <Field orientation='horizontal'>
                <FieldLabel htmlFor='h-name'>Name</FieldLabel>
                <Input id='h-name' placeholder='Jane Doe' />
            </Field>
            <Field orientation='horizontal'>
                <FieldLabel htmlFor='h-email'>Email</FieldLabel>
                <Input id='h-email' type='email' placeholder='jane@example.com' />
            </Field>
        </FieldGroup>
    ),
};

export const CompleteForm: Story = {
    render: () => (
        <FieldSet className='max-w-sm'>
            <FieldLegend>Account details</FieldLegend>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor='cf-name'>Full name</FieldLabel>
                    <Input id='cf-name' placeholder='Jane Doe' />
                    <FieldDescription>This will appear on your profile.</FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor='cf-email'>Email</FieldLabel>
                    <Input id='cf-email' type='email' placeholder='jane@example.com' />
                </Field>
                <FieldSeparator>or</FieldSeparator>
                <Field>
                    <FieldLabel htmlFor='cf-phone'>Phone</FieldLabel>
                    <Input id='cf-phone' type='tel' placeholder='+1 555 000 0000' />
                </Field>
                <Field>
                    <div className='flex items-center gap-2'>
                        <Checkbox id='cf-agree' />
                        <FieldLabel htmlFor='cf-agree'>I agree to the terms of service</FieldLabel>
                    </div>
                </Field>
            </FieldGroup>
        </FieldSet>
    ),
};

export const MultipleErrors: Story = {
    render: () => (
        <Field data-invalid='true' className='max-w-sm'>
            <FieldLabel htmlFor='me-pass'>Password</FieldLabel>
            <Input id='me-pass' type='password' aria-invalid defaultValue='abc' />
            <FieldError
                errors={[
                    { message: 'Must be at least 8 characters' },
                    { message: 'Must include a number' },
                    { message: 'Must include a special character' },
                ]}
            />
        </Field>
    ),
};
