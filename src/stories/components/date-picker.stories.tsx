import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerDemo } from '@/uis/date-picker';

const meta = {
    title: 'Components/Inputs/DatePicker',
    component: DatePickerDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DatePickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
