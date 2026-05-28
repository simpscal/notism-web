import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/chart';
import type { ChartConfig } from '@/components/chart';

const meta = {
    title: 'Components/Chart',
    component: ChartContainer,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const barData = [
    { month: 'Jan', revenue: 4200, expenses: 2800 },
    { month: 'Feb', revenue: 3800, expenses: 2600 },
    { month: 'Mar', revenue: 5200, expenses: 3100 },
    { month: 'Apr', revenue: 4700, expenses: 2900 },
    { month: 'May', revenue: 6100, expenses: 3400 },
    { month: 'Jun', revenue: 5800, expenses: 3200 },
];

const barConfig: ChartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
    expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
};

export const BarChartDefault: Story = {
    name: 'Bar Chart',
    render: () => (
        <ChartContainer config={barConfig} className='h-[300px] w-full max-w-[640px]'>
            <BarChart data={barData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='revenue' fill='var(--color-revenue)' radius={4} />
                <Bar dataKey='expenses' fill='var(--color-expenses)' radius={4} />
            </BarChart>
        </ChartContainer>
    ),
    args: {
        config: barConfig,
        children: null as unknown as React.ReactNode,
    },
};

const lineData = [
    { week: 'W1', users: 120 },
    { week: 'W2', users: 145 },
    { week: 'W3', users: 132 },
    { week: 'W4', users: 178 },
    { week: 'W5', users: 196 },
    { week: 'W6', users: 221 },
];

const lineConfig: ChartConfig = {
    users: { label: 'Active Users', color: 'hsl(var(--chart-1))' },
};

export const LineChartDefault: Story = {
    name: 'Line Chart',
    render: () => (
        <ChartContainer config={lineConfig} className='h-[300px] w-full max-w-[640px]'>
            <LineChart data={lineData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='week' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey='users' stroke='var(--color-users)' strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
        </ChartContainer>
    ),
    args: {
        config: lineConfig,
        children: null as unknown as React.ReactNode,
    },
};

export const WithLegend: Story = {
    name: 'Bar Chart with Legend',
    render: () => (
        <ChartContainer config={barConfig} className='h-[320px] w-full max-w-[640px]'>
            <BarChart data={barData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey='revenue' fill='var(--color-revenue)' radius={4} />
                <Bar dataKey='expenses' fill='var(--color-expenses)' radius={4} />
            </BarChart>
        </ChartContainer>
    ),
    args: {
        config: barConfig,
        children: null as unknown as React.ReactNode,
    },
};
