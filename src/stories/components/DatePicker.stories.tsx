import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerDemo } from '@/components/date-picker';

const meta = {
    title: 'Components/DatePicker',
    component: DatePickerDemo,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DatePickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
