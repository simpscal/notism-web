import { FoodCategoryEnum } from '../enums';

import { ListItemModel } from '@/app/models';

export const FOOD_CATEGORIES: ListItemModel[] = [
    {
        value: FoodCategoryEnum.Pizza,
        label: 'Pizza',
    },
    {
        value: FoodCategoryEnum.Burger,
        label: 'Burger',
    },
    {
        value: FoodCategoryEnum.Salad,
        label: 'Salad',
    },
    {
        value: FoodCategoryEnum.Pasta,
        label: 'Pasta',
    },
    {
        value: FoodCategoryEnum.Dessert,
        label: 'Dessert',
    },
    {
        value: FoodCategoryEnum.Drink,
        label: 'Drink',
    },
    {
        value: FoodCategoryEnum.Appetizer,
        label: 'Appetizer',
    },
    {
        value: FoodCategoryEnum.Soup,
        label: 'Soup',
    },
    {
        value: FoodCategoryEnum.Sandwich,
        label: 'Sandwich',
    },
    {
        value: FoodCategoryEnum.Breakfast,
        label: 'Breakfast',
    },
] as const;
