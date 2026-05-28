import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Badge } from '@/components/badge';
import {
    SortableTableHead,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TablePagination,
    TableRow,
    useTableSort,
} from '@/components/table';

const meta = {
    title: 'Components/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const foodItems = [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: '$14.00', status: 'Available' },
    { id: 2, name: 'Beef Burger', category: 'Burger', price: '$12.50', status: 'Available' },
    { id: 3, name: 'Caesar Salad', category: 'Salad', price: '$9.00', status: 'Out of Stock' },
    { id: 4, name: 'Tiramisu', category: 'Dessert', price: '$7.50', status: 'Available' },
    { id: 5, name: 'Pasta Carbonara', category: 'Pasta', price: '$13.00', status: 'Limited' },
];

const statusVariant: Record<string, 'success' | 'destructive' | 'secondary'> = {
    Available: 'success',
    'Out of Stock': 'destructive',
    Limited: 'secondary',
};

export const Default: Story = {
    render: () => (
        <div className='h-[320px] w-full max-w-2xl'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    ),
};

export const WithCaption: Story = {
    render: () => (
        <div className='h-[360px] w-full max-w-2xl'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>A list of current menu items and their availability.</TableCaption>
            </Table>
        </div>
    ),
};

type FoodField = 'name' | 'category' | 'price' | 'status';

function WithSortableHeadersDemo() {
    const { sortBy, sortOrder, handleSort } = useTableSort<FoodField>();
    return (
        <div className='h-[320px] w-full max-w-2xl'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableTableHead field='name' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                            Name
                        </SortableTableHead>
                        <SortableTableHead field='category' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                            Category
                        </SortableTableHead>
                        <SortableTableHead field='price' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                            Price
                        </SortableTableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export const WithSortableHeaders: Story = {
    render: () => <WithSortableHeadersDemo />,
};

function WithPaginationDemo() {
    const [page, setPage] = useState(1);
    const totalPages = 5;
    return (
        <div className='h-[400px] flex flex-col w-full max-w-2xl border rounded-lg overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export const WithPagination: Story = {
    render: () => <WithPaginationDemo />,
};

export const SubtleDividers: Story = {
    name: 'Subtle Dividers (border-divider)',
    render: () => (
        <div className='w-full max-w-2xl shadow-surface rounded-container border overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {foodItems.map(item => (
                        <TableRow key={item.id} style={{ borderColor: 'var(--border-divider)' }}>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[item.status]} className='rounded-pill'>
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    ),
};
