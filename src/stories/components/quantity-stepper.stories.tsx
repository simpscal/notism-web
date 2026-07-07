import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import QuantityStepper from '@/components/quantity-stepper';

const meta = {
    title: 'Components/Inputs/Quantity Stepper',
    component: QuantityStepper,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — circular −/+ buttons flanking the numeral in the black ink treatment.
 * Wired to local state so the control can be driven end to end.
 */
export const Default: Story = {
    args: { value: 2, onIncrement: () => {}, onDecrement: () => {} },
    render: function Render() {
        const [value, setValue] = useState(2);
        return (
            <QuantityStepper
                value={value}
                onIncrement={() => setValue(v => v + 1)}
                onDecrement={() => setValue(v => v - 1)}
            />
        );
    },
};

/**
 * At minimum — the − button disables once `value` reaches `min` (default 1).
 */
export const AtMinBound: Story = {
    args: { value: 1, min: 1, onIncrement: () => {}, onDecrement: () => {} },
};

/**
 * At maximum — the + button disables once `value` reaches `max` (e.g. stock cap).
 */
export const AtMaxBound: Story = {
    args: { value: 5, min: 1, max: 5, onIncrement: () => {}, onDecrement: () => {} },
};

/**
 * Bounded — steps between `min` and `max`; each button disables at its bound.
 */
export const WithinBounds: Story = {
    args: { value: 3, min: 1, max: 5, onIncrement: () => {}, onDecrement: () => {} },
    render: function Render() {
        const [value, setValue] = useState(3);
        return (
            <QuantityStepper
                value={value}
                min={1}
                max={5}
                onIncrement={() => setValue(v => Math.min(5, v + 1))}
                onDecrement={() => setValue(v => Math.max(1, v - 1))}
            />
        );
    },
};

/**
 * Disabled — both controls are inert regardless of bounds.
 */
export const Disabled: Story = {
    args: { value: 2, disabled: true, onIncrement: () => {}, onDecrement: () => {} },
};
