import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePickerWithPresets } from '@/uis/preset-date-picker';

const meta = {
    title: 'Components/Inputs/PresetDatePicker',
    component: DatePickerWithPresets,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DatePickerWithPresets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
