import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';
import Kanban, { type KanbanColumn } from '@/components/kanban';

interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
}

const initialColumns: KanbanColumn<Task>[] = [
    {
        id: 'todo',
        title: 'To Do',
        items: [
            { id: '1', title: 'Design mockups', priority: 'high' },
            { id: '2', title: 'Write unit tests', priority: 'medium' },
            { id: '3', title: 'Update docs', priority: 'low' },
        ],
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        items: [
            { id: '4', title: 'Implement auth flow', priority: 'high' },
            { id: '5', title: 'Refactor API layer', priority: 'medium' },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        items: [{ id: '6', title: 'Setup project', priority: 'low' }],
    },
];

const priorityVariant: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
    high: 'destructive',
    medium: 'default',
    low: 'outline',
};

function KanbanDemo() {
    const [columns, setColumns] = useState(initialColumns);

    const handleItemMove = (itemId: string, sourceColumnId: string, targetColumnId: string) => {
        setColumns(prev => {
            const newCols = prev.map(col => ({ ...col, items: [...col.items] }));
            const sourceCol = newCols.find(c => c.id === sourceColumnId);
            const targetCol = newCols.find(c => c.id === targetColumnId);
            if (!sourceCol || !targetCol) return prev;
            const itemIdx = sourceCol.items.findIndex(i => i.id === itemId);
            if (itemIdx === -1) return prev;
            const [item] = sourceCol.items.splice(itemIdx, 1);
            targetCol.items.push(item);
            return newCols;
        });
    };

    return (
        <Kanban
            columns={columns}
            onItemMove={handleItemMove}
            getItemId={item => item.id}
            renderItem={item => (
                <Card>
                    <CardContent
                        style={{
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>{item.title}</span>
                        <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
                    </CardContent>
                </Card>
            )}
        />
    );
}

const meta = {
    title: 'Components/Display/Kanban',
    component: KanbanDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof KanbanDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
    render: () => (
        <Kanban
            columns={initialColumns}
            getItemId={item => item.id}
            isDisabled
            renderItem={item => (
                <Card>
                    <CardContent style={{ padding: '12px' }}>
                        <span style={{ fontSize: '14px' }}>{item.title}</span>
                    </CardContent>
                </Card>
            )}
        />
    ),
};
