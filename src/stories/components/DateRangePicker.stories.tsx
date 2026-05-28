import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerWithRange } from '@/components/date-range-picker';

const meta = {
    title: 'Components/DateRangePicker',
    component: DatePickerWithRange,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DatePickerWithRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoInitialRange: Story = {
    render: () => <DatePickerWithRange />,
};
