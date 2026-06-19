export const FOOD_ENDPOINTS = {
    LIST: 'foods',
    DETAIL: (id: string) => `foods/${id}`,
    CATEGORIES: 'foods/categories',
} as const;

export const FOOD_QUERY_KEYS = {
    detail: (id: string) => ['foods', 'detail', id] as const,
    list: <TFilters>(filters: TFilters) => ['foods', 'infinite', filters] as const,
};
