import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/pagination';

const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href='#' />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#' isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href='#' />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const WithEllipsis: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href='#' />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#' isActive>
                        5
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>6</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href='#' />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const FirstPage: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href='#' className='pointer-events-none opacity-50' />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#' isActive>
                        1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href='#' />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

export const LastPage: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href='#' />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#'>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href='#' isActive>
                        3
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href='#' className='pointer-events-none opacity-50' />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};
