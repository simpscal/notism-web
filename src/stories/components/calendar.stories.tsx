import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Calendar } from '@/components/calendar';

const meta = {
    title: 'Components/Inputs/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode='single' selected={date} onSelect={setDate} className='rounded-md border' />;
}

function RangeCalendar() {
    const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
    return (
        <Calendar
            mode='range'
            selected={{ from: range.from, to: range.to }}
            onSelect={r => setRange(r ?? {})}
            numberOfMonths={2}
            className='rounded-md border'
        />
    );
}

export const Default: Story = {
    render: () => <SingleCalendar />,
};

export const RangeMode: Story = {
    render: () => <RangeCalendar />,
};
