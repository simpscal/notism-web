import { http, HttpResponse, delay } from 'msw';

import foodsData from './data/foods.json';

import type { FoodItemResponseModel, GetFoodByIdResponseModel } from '@/apis/models';
import { API_ENDPOINTS } from '@/app/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path: string) => `${API_BASE_URL}/${path}`;

export const handlers = [
    http.post(buildUrl(API_ENDPOINTS.FOOD.LIST), async ({ request }) => {
        await delay(600);

        const body = (await request.json()) as
            | {
                  skip?: number;
                  take?: number;
                  category?: string;
                  keyword?: string;
                  isAvailable?: boolean;
              }
            | undefined;

        let filteredFoods: FoodItemResponseModel[] = foodsData.foods.map(food => ({
            ...food,
            imageUrl: food.imageUrl || '',
        }));

        // Filter by category
        if (body?.category) {
            filteredFoods = filteredFoods.filter(food => food.category === body.category);
        }

        // Filter by keyword
        if (body?.keyword) {
            const keyword = body.keyword.toLowerCase();
            filteredFoods = filteredFoods.filter(
                food => food.name.toLowerCase().includes(keyword) || food.description.toLowerCase().includes(keyword)
            );
        }

        // Filter by availability
        if (body?.isAvailable !== undefined) {
            filteredFoods = filteredFoods.filter(food => food.isAvailable === body.isAvailable);
        }

        const totalCount = filteredFoods.length;

        // Apply pagination
        const skip = body?.skip || 0;
        const take = body?.take || 10;
        const paginatedFoods = filteredFoods.slice(skip, skip + take);

        return HttpResponse.json({
            totalCount,
            items: paginatedFoods,
        });
    }),

    http.get(buildUrl(API_ENDPOINTS.FOOD.CATEGORIES), async () => {
        await delay(300);

        const uniqueCategories = new Set(foodsData.foods.map(food => food.category));
        const categoryMap = new Map(foodsData.categories.map(cat => [cat.value, cat.label]));

        const categories = Array.from(uniqueCategories)
            .map(categoryValue => ({
                value: categoryValue,
                label: categoryMap.get(categoryValue) || categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        return HttpResponse.json({ categories });
    }),

    http.get(`${buildUrl(API_ENDPOINTS.FOOD.LIST)}/:id`, async ({ params }) => {
        await delay(400);

        const id = params.id as string;
        const food = foodsData.foods.find(f => f.id === id);

        if (!food) {
            return HttpResponse.json({ message: 'Food not found' }, { status: 404 });
        }

        const foodDetail: GetFoodByIdResponseModel = {
            ...food,
            imageUrl: food.imageUrl || '',
            createdAt: food.createdAt || new Date().toISOString(),
            updatedAt: food.updatedAt || null,
        };

        return HttpResponse.json(foodDetail);
    }),
];
