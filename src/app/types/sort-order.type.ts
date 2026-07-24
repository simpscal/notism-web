export const SortOrderType = {
    Asc: 'asc',
    Desc: 'desc',
} as const;

export type SortOrderType = (typeof SortOrderType)[keyof typeof SortOrderType];
