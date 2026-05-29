import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';

const meta = {
    title: 'Components/Inputs/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
            <Label htmlFor='message'>Your message</Label>
            <Textarea placeholder='Type your message here.' id='message' />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ width: '320px' }}>
            <Textarea placeholder='Disabled textarea' disabled />
        </div>
    ),
};

export const WithText: Story = {
    render: () => (
        <div style={{ width: '320px' }}>
            <Textarea defaultValue='This is some pre-filled text in the textarea component.' />
        </div>
    ),
};
