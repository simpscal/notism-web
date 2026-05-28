import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import Kanban from '@/components/kanban';
import type { KanbanColumn } from '@/components/kanban';

interface TaskCard {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    assignee: string;
}

const priorityColor: Record<TaskCard['priority'], string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-accent text-accent-foreground',
    high: 'bg-destructive/10 text-destructive',
};

function TaskCardItem({ item }: { item: TaskCard }) {
    return (
        <div className='rounded-lg border bg-card p-3 shadow-xs'>
            <div className='flex items-start justify-between gap-2'>
                <p className='text-sm font-medium leading-snug'>{item.title}</p>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor[item.priority]}`}
                >
                    {item.priority}
                </span>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>Assigned to {item.assignee}</p>
        </div>
    );
}

const initialColumns: KanbanColumn<TaskCard>[] = [
    {
        id: 'todo',
        title: 'To Do',
        items: [
            { id: '1', title: 'Research competitor pricing', priority: 'medium', assignee: 'Alice' },
            { id: '2', title: 'Update onboarding flow', priority: 'high', assignee: 'Bob' },
            { id: '3', title: 'Write release notes', priority: 'low', assignee: 'Carol' },
        ],
        totalCount: 3,
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        items: [
            { id: '4', title: 'Redesign settings page', priority: 'high', assignee: 'Alice' },
            { id: '5', title: 'Fix mobile nav bug', priority: 'medium', assignee: 'Dave' },
        ],
        totalCount: 2,
    },
    {
        id: 'done',
        title: 'Done',
        items: [
            { id: '6', title: 'Set up CI pipeline', priority: 'low', assignee: 'Bob' },
            { id: '7', title: 'Migrate to Tailwind v4', priority: 'medium', assignee: 'Carol' },
        ],
        totalCount: 2,
    },
];

const meta = {
    title: 'Components/Kanban',
    component: Kanban,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Kanban>;

export default meta;
type Story = StoryObj<typeof meta>;

function KanbanDefault() {
    const [columns, setColumns] = React.useState<KanbanColumn<TaskCard>[]>(initialColumns);

    const handleItemMove = (itemId: string, sourceColumnId: string, targetColumnId: string) => {
        setColumns(prev => {
            const updated = prev.map(col => ({ ...col, items: [...col.items] }));
            const source = updated.find(c => c.id === sourceColumnId);
            const target = updated.find(c => c.id === targetColumnId);
            if (!source || !target) return prev;
            const itemIndex = source.items.findIndex(i => i.id === itemId);
            if (itemIndex === -1) return prev;
            const [item] = source.items.splice(itemIndex, 1);
            target.items.push(item);
            source.totalCount = source.items.length;
            target.totalCount = target.items.length;
            return updated;
        });
    };

    return (
        <div className='h-screen w-full'>
            <Kanban
                columns={columns}
                onItemMove={handleItemMove}
                renderItem={item => <TaskCardItem item={item} />}
                getItemId={item => item.id}
                columnWidth={300}
            />
        </div>
    );
}

export const Default: Story = {
    render: () => <KanbanDefault />,
    args: {
        columns: [],
        renderItem: () => null,
        getItemId: () => '',
    },
};

export const Disabled: Story = {
    render: () => (
        <div className='h-screen w-full'>
            <Kanban
                columns={initialColumns}
                renderItem={item => <TaskCardItem item={item} />}
                getItemId={item => item.id}
                isDisabled
                columnWidth={300}
            />
        </div>
    ),
    args: {
        columns: [],
        renderItem: () => null,
        getItemId: () => '',
    },
};

export const SingleColumn: Story = {
    render: () => (
        <div className='h-64 w-full'>
            <Kanban
                columns={[initialColumns[0]]}
                renderItem={item => <TaskCardItem item={item} />}
                getItemId={item => item.id}
                columnWidth={320}
            />
        </div>
    ),
    args: {
        columns: [],
        renderItem: () => null,
        getItemId: () => '',
    },
};
