import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Calendar } from '@/components/calendar';

const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function CalendarDefault() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return <Calendar mode='single' selected={date} onSelect={setDate} />;
}

export const Default: Story = {
    render: () => <CalendarDefault />,
};

export const NoSelection: Story = {
    render: () => <Calendar mode='single' />,
};

function CalendarRangeMode() {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>({
        from: new Date(2025, 4, 10),
        to: new Date(2025, 4, 20),
    });
    return (
        <Calendar
            mode='range'
            selected={range}
            onSelect={setRange as (r: { from?: Date; to?: Date } | undefined) => void}
            numberOfMonths={2}
        />
    );
}

export const RangeMode: Story = {
    render: () => <CalendarRangeMode />,
};

export const HideOutsideDays: Story = {
    render: () => <Calendar mode='single' showOutsideDays={false} />,
};
