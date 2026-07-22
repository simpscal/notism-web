import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/uis/table';

const invoices = [
    {
        invoice: 'INV001',
        statusKey: 'storybook.table.statusPaid',
        totalAmount: '$250.00',
        methodKey: 'storybook.table.methodCreditCard',
    },
    {
        invoice: 'INV002',
        statusKey: 'storybook.table.statusPending',
        totalAmount: '$150.00',
        methodKey: 'storybook.table.methodPaypal',
    },
    {
        invoice: 'INV003',
        statusKey: 'storybook.table.statusUnpaid',
        totalAmount: '$350.00',
        methodKey: 'storybook.table.methodBankTransfer',
    },
    {
        invoice: 'INV004',
        statusKey: 'storybook.table.statusPaid',
        totalAmount: '$450.00',
        methodKey: 'storybook.table.methodCreditCard',
    },
    {
        invoice: 'INV005',
        statusKey: 'storybook.table.statusPaid',
        totalAmount: '$550.00',
        methodKey: 'storybook.table.methodPaypal',
    },
    {
        invoice: 'INV006',
        statusKey: 'storybook.table.statusPending',
        totalAmount: '$200.00',
        methodKey: 'storybook.table.methodBankTransfer',
    },
    {
        invoice: 'INV007',
        statusKey: 'storybook.table.statusUnpaid',
        totalAmount: '$300.00',
        methodKey: 'storybook.table.methodCreditCard',
    },
];

const meta = {
    title: 'Components/Display/Table',
    component: Table,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '600px', height: '400px' }}>
                <Table>
                    <TableCaption>{t('storybook.table.caption')}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[100px]'>{t('storybook.table.invoice')}</TableHead>
                            <TableHead>{t('storybook.table.status')}</TableHead>
                            <TableHead>{t('storybook.table.method')}</TableHead>
                            <TableHead className='text-right'>{t('storybook.table.amount')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map(invoice => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className='font-medium'>{invoice.invoice}</TableCell>
                                <TableCell>{t(invoice.statusKey)}</TableCell>
                                <TableCell>{t(invoice.methodKey)}</TableCell>
                                <TableCell className='text-right'>{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>{t('storybook.table.total')}</TableCell>
                            <TableCell className='text-right'>$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    },
};
