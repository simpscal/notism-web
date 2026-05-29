import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/chart';

const barData = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
    { month: 'Apr', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'Jun', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

function BarChartDemo() {
    return (
        <ChartContainer config={chartConfig} style={{ height: '200px', width: '400px' }}>
            <BarChart data={barData}>
                <XAxis dataKey='month' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
                <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
            </BarChart>
        </ChartContainer>
    );
}

function LineChartDemo() {
    return (
        <ChartContainer config={chartConfig} style={{ height: '200px', width: '400px' }}>
            <LineChart data={barData}>
                <XAxis dataKey='month' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type='monotone' dataKey='desktop' stroke='var(--color-desktop)' strokeWidth={2} />
                <Line type='monotone' dataKey='mobile' stroke='var(--color-mobile)' strokeWidth={2} />
            </LineChart>
        </ChartContainer>
    );
}

const meta = {
    title: 'Components/Display/Chart',
    component: BarChartDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BarChartDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarChartStory: Story = {
    name: 'Bar Chart',
};

export const LineChartStory: Story = {
    name: 'Line Chart',
    render: () => <LineChartDemo />,
};
