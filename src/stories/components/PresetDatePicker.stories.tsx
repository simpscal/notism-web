import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerWithPresets } from '@/components/preset-date-picker';

const meta = {
    title: 'Components/PresetDatePicker',
    component: DatePickerWithPresets,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DatePickerWithPresets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className='pb-[400px]'>
            <DatePickerWithPresets />
        </div>
    ),
};
