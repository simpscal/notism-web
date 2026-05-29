import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible';

const meta = {
    title: 'Components/Layout/Collapsible',
    component: Collapsible,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

function CollapsibleDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            style={{ width: '350px', gap: '8px', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500 }}>@peduarte starred 3 repositories</h4>
                <CollapsibleTrigger asChild>
                    <Button variant='ghost' size='icon-sm'>
                        <ChevronsUpDown />
                        <span className='sr-only'>Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div
                style={{
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                }}
            >
                @radix-ui/primitives
            </div>
            <CollapsibleContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                    style={{
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                    }}
                >
                    @radix-ui/colors
                </div>
                <div
                    style={{
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                    }}
                >
                    @stitches/react
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export const Default: Story = {
    render: () => <CollapsibleDemo />,
};
