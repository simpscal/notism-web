import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import * as React from 'react';

import { SortOrderEnum } from '@/app/enums';
import { cn } from '@/app/utils/tailwind.utils';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/pagination';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div data-slot='table-container' className='relative w-full h-full flex flex-col overflow-hidden'>
            <div className='overflow-auto flex-1 min-h-0'>
                <table data-slot='table' className={cn('w-full caption-bottom text-sm', className)} {...props} />
            </div>
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return (
        <thead
            data-slot='table-header'
            className={cn('[&_tr]:border-b sticky top-0 z-10 bg-background', className)}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
    return (
        <tfoot
            data-slot='table-footer'
            className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr
            data-slot='table-row'
            className={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', className)}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th
            data-slot='table-head'
            className={cn(
                'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return (
        <td
            data-slot='table-cell'
            className={cn(
                'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                className
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return (
        <caption data-slot='table-caption' className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
    );
}

interface TablePaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TablePagination = memo(function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps) {
    const handlePrevious = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (page > 1) {
                onPageChange(page - 1);
            }
        },
        [page, onPageChange]
    );

    const handleNext = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (page < totalPages) {
                onPageChange(page + 1);
            }
        },
        [page, totalPages, onPageChange]
    );

    const handlePageClick = useCallback(
        (targetPage: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onPageChange(targetPage);
        },
        [onPageChange]
    );

    if (totalPages <= 1) {
        return null;
    }

    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (page > 3) {
            pages.push('ellipsis');
        }

        // Show pages around current page
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        if (page < totalPages - 2) {
            pages.push('ellipsis');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
    }

    return (
        <div className='border-t px-4 py-4'>
            <Pagination className='justify-start'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href='#'
                            onClick={handlePrevious}
                            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>

                    {pages.map((item, index) => {
                        if (item === 'ellipsis') {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
                        return (
                            <PaginationItem key={item}>
                                <PaginationLink href='#' onClick={handlePageClick(item)} isActive={item === page}>
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href='#'
                            onClick={handleNext}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
});

export function useTableSort<T extends string>(onPageReset?: () => void) {
    const [sortBy, setSortBy] = useState<T | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<SortOrderEnum>(SortOrderEnum.Asc);

    const handleSort = useCallback(
        (field: T) => {
            if (sortBy === field) {
                setSortOrder(sortOrder === SortOrderEnum.Asc ? SortOrderEnum.Desc : SortOrderEnum.Asc);
            } else {
                setSortBy(field);
                setSortOrder(SortOrderEnum.Asc);
            }
            onPageReset?.();
        },
        [sortBy, sortOrder, onPageReset]
    );

    return {
        sortBy,
        sortOrder,
        handleSort,
    };
}

interface SortableTableHeadProps extends React.ComponentProps<'th'> {
    field: string;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
    onSort: (field: string) => void;
    children: React.ReactNode;
}

const SortableTableHead = memo(function SortableTableHead({
    field,
    sortBy,
    sortOrder,
    onSort,
    children,
    className,
    ...props
}: SortableTableHeadProps) {
    const getSortIcon = () => {
        if (sortBy !== field) {
            return <ArrowUpDown className='ml-2 h-4 w-4 text-muted-foreground' />;
        }
        return sortOrder === SortOrderEnum.Asc ? (
            <ArrowUp className='ml-2 h-4 w-4' />
        ) : (
            <ArrowDown className='ml-2 h-4 w-4' />
        );
    };

    return (
        <TableHead
            className={cn('cursor-pointer hover:bg-muted/50', className)}
            onClick={() => onSort(field)}
            {...props}
        >
            <div className='flex items-center'>
                {children}
                {getSortIcon()}
            </div>
        </TableHead>
    );
});

export { SortableTableHead };
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TablePagination };
