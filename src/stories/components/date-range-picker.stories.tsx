import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerWithRange } from '@/components/date-range-picker';

const meta = {
    title: 'Components/Inputs/DateRangePicker',
    component: DatePickerWithRange,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DatePickerWithRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
