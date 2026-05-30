import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';
import Kanban, { type KanbanColumn } from '@/components/kanban';

interface Task {
    id: string;
    titleKey: string;
    priority: 'low' | 'medium' | 'high';
}

const initialColumns: KanbanColumn<Task>[] = [
    {
        id: 'todo',
        title: 'storybook.kanban.todo',
        items: [
            { id: '1', titleKey: 'storybook.kanban.designMockups', priority: 'high' },
            { id: '2', titleKey: 'storybook.kanban.writeUnitTests', priority: 'medium' },
            { id: '3', titleKey: 'storybook.kanban.updateDocs', priority: 'low' },
        ],
    },
    {
        id: 'in-progress',
        title: 'storybook.kanban.inProgress',
        items: [
            { id: '4', titleKey: 'storybook.kanban.implementAuthFlow', priority: 'high' },
            { id: '5', titleKey: 'storybook.kanban.refactorApiLayer', priority: 'medium' },
        ],
    },
    {
        id: 'done',
        title: 'storybook.kanban.done',
        items: [{ id: '6', titleKey: 'storybook.kanban.setupProject', priority: 'low' }],
    },
];

const priorityVariant: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
    high: 'destructive',
    medium: 'default',
    low: 'outline',
};

const priorityKey: Record<string, string> = {
    high: 'storybook.kanban.priorityHigh',
    medium: 'storybook.kanban.priorityMedium',
    low: 'storybook.kanban.priorityLow',
};

function KanbanDemo() {
    const { t } = useTranslation();
    const [columns, setColumns] = useState(() =>
        initialColumns.map(col => ({ ...col, title: t(col.title), items: [...col.items] }))
    );

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
                        <span style={{ fontSize: '14px' }}>{t(item.titleKey)}</span>
                        <Badge variant={priorityVariant[item.priority]}>{t(priorityKey[item.priority])}</Badge>
                    </CardContent>
                </Card>
            )}
        />
    );
}

function KanbanDisabledDemo() {
    const { t } = useTranslation();
    const columns = initialColumns.map(col => ({ ...col, title: t(col.title) }));

    return (
        <Kanban
            columns={columns}
            getItemId={item => item.id}
            isDisabled
            renderItem={item => (
                <Card>
                    <CardContent style={{ padding: '12px' }}>
                        <span style={{ fontSize: '14px' }}>{t(item.titleKey)}</span>
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
    render: () => <KanbanDisabledDemo />,
};
