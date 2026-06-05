import { http, HttpResponse, delay } from 'msw';

import categoriesData from '../data/categories.json';
import foodsData from '../data/foods.json';
import { buildUrl } from '../utils';

import type { CategoryResponseModel, FoodItemResponseModel, GetFoodByIdResponseModel } from '@/apis/models';
import { API_ENDPOINTS } from '@/app/constants';

export const foodHandlers = [
    http.get(buildUrl(API_ENDPOINTS.FOOD.CATEGORIES), async () => {
        await delay(300);

        const categories: CategoryResponseModel[] = (categoriesData as { id: string; name: string }[]).map(c => ({
            id: c.id,
            name: c.name,
        }));
        return HttpResponse.json(categories);
    }),

    http.get(buildUrl(API_ENDPOINTS.FOOD.LIST), async ({ request }) => {
        await delay(600);

        const url = new URL(request.url);
        const skip = url.searchParams.has('skip') ? Number(url.searchParams.get('skip')) : 0;
        const take = url.searchParams.has('take') ? Number(url.searchParams.get('take')) : 10;
        const category = url.searchParams.get('category') ?? undefined;
        const keyword = url.searchParams.get('keyword') ?? undefined;
        const isAvailableParam = url.searchParams.get('isAvailable');
        const isAvailable = isAvailableParam === 'true' ? true : isAvailableParam === 'false' ? false : undefined;

        let filteredFoods: FoodItemResponseModel[] = foodsData.foods.map(food => ({
            ...food,
            imageUrl: food.imageUrl || '',
        }));

        if (category) {
            filteredFoods = filteredFoods.filter(food => food.category === category);
        }
        if (keyword) {
            const kw = keyword.toLowerCase();
            filteredFoods = filteredFoods.filter(
                food => food.name.toLowerCase().includes(kw) || food.description.toLowerCase().includes(kw)
            );
        }
        if (isAvailable !== undefined) {
            filteredFoods = filteredFoods.filter(food => food.isAvailable === isAvailable);
        }

        const totalCount = filteredFoods.length;
        const paginatedFoods = filteredFoods.slice(skip, skip + take);

        return HttpResponse.json({
            totalCount,
            items: paginatedFoods,
        });
    }),

    http.get(`${buildUrl(API_ENDPOINTS.FOOD.LIST)}/:id`, async ({ params }) => {
        await delay(400);

        const id = params.id as string;
        const food = foodsData.foods.find(f => f.id === id);

        if (!food) {
            return HttpResponse.json({ message: 'Food not found' }, { status: 404 });
        }

        const imageUrls =
            (food as unknown as GetFoodByIdResponseModel).imageUrls &&
            Array.isArray((food as unknown as GetFoodByIdResponseModel).imageUrls)
                ? (food as unknown as GetFoodByIdResponseModel).imageUrls
                : food.imageUrl
                  ? [
                        food.imageUrl,
                        food.imageUrl.replace('?w=400', '?w=800'),
                        food.imageUrl.replace('?w=400', '?w=600'),
                    ]
                  : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'];

        const { ...foodWithoutImageUrls } = food;

        const foodDetail: GetFoodByIdResponseModel = {
            ...foodWithoutImageUrls,
            imageUrls,
            createdAt: food.createdAt || new Date().toISOString(),
            updatedAt: food.updatedAt || null,
            customisations: [],
        };

        return HttpResponse.json(foodDetail);
    }),
];
