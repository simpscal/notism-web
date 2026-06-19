import { http, HttpResponse, delay } from 'msw';

import foodsData from '../data/foods.json';
import { buildUrl } from '../utils';

import type { AdminFoodItemResponseModel, GetAdminFoodDetailResponseModel, GetFoodByIdResponseModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';

export const adminFoodsHandlers = [
    http.get(buildUrl(ADMIN_ENDPOINTS.FOODS), async ({ request }) => {
        await delay(500);

        const url = new URL(request.url);
        const skip = parseInt(url.searchParams.get('skip') || '0', 10);
        const take = parseInt(url.searchParams.get('take') || '20', 10);
        const keyword = url.searchParams.get('keyword') || '';
        const category = url.searchParams.get('category') || '';
        const isAvailableParam = url.searchParams.get('isAvailable');
        const sortBy = url.searchParams.get('sortBy') || '';
        const sortOrder = url.searchParams.get('sortOrder') || 'asc';

        let filteredFoods: AdminFoodItemResponseModel[] = foodsData.foods.map(food => {
            const imageUrl =
                food.imageUrl ||
                (Array.isArray((food as unknown as GetFoodByIdResponseModel).imageUrls) &&
                (food as unknown as GetFoodByIdResponseModel).imageUrls?.length
                    ? (food as unknown as GetFoodByIdResponseModel).imageUrls[0]
                    : '');
            return {
                id: food.id,
                name: food.name,
                description: food.description,
                price: food.price,
                discountPrice: food.discountPrice ?? null,
                imageUrl,
                category: food.category,
                isAvailable: food.isAvailable,
                stockQuantity: food.stockQuantity,
                quantityUnit: food.quantityUnit,
            };
        });

        if (category) {
            filteredFoods = filteredFoods.filter(f => f.category === category);
        }
        if (keyword) {
            const k = keyword.toLowerCase();
            filteredFoods = filteredFoods.filter(
                f => f.name.toLowerCase().includes(k) || f.description.toLowerCase().includes(k)
            );
        }
        if (isAvailableParam !== null && isAvailableParam !== '') {
            const available = isAvailableParam === 'true';
            filteredFoods = filteredFoods.filter(f => f.isAvailable === available);
        }

        if (sortBy) {
            const direction = sortOrder === 'desc' ? -1 : 1;
            filteredFoods = [...filteredFoods].sort((a, b) => {
                if (sortBy === 'name') {
                    return direction * a.name.localeCompare(b.name);
                }
                if (sortBy === 'price') {
                    return direction * (a.price - b.price);
                }
                if (sortBy === 'discountPrice') {
                    const nullLast = sortOrder === 'desc' ? -Infinity : Infinity;
                    const aVal = a.discountPrice ?? nullLast;
                    const bVal = b.discountPrice ?? nullLast;
                    return direction * (aVal - bVal);
                }
                return 0;
            });
        }

        const totalCount = filteredFoods.length;
        const items = filteredFoods.slice(skip, skip + take);

        return HttpResponse.json({ items, totalCount });
    }),

    http.get(`${buildUrl(ADMIN_ENDPOINTS.FOODS)}/:id`, async ({ params }) => {
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

        const images = imageUrls.map((imageUrl, displayOrder) => ({
            fileKey: imageUrl,
            displayOrder,
            altText: undefined as string | undefined,
            imageUrl,
        }));

        const foodDetail: GetAdminFoodDetailResponseModel = {
            id: food.id,
            name: food.name,
            description: food.description,
            price: food.price,
            discountPrice: food.discountPrice ?? null,
            images,
            category: food.category,
            categoryId: food.category,
            isAvailable: food.isAvailable,
            stockQuantity: food.stockQuantity,
            quantityUnit: food.quantityUnit,
            createdAt: food.createdAt || new Date().toISOString(),
            updatedAt: food.updatedAt || null,
            customisations: [],
        };

        return HttpResponse.json(foodDetail);
    }),

    http.patch(`${buildUrl(ADMIN_ENDPOINTS.FOODS)}/:id`, async ({ params, request }) => {
        await delay(300);

        const id = params.id as string;
        const food = foodsData.foods.find(f => f.id === id);

        if (!food) {
            return HttpResponse.json({ message: 'Food not found' }, { status: 404 });
        }

        const body = (await request.json()) as Partial<{
            name: string;
            description: string;
            price: number;
            discountPrice: number | null;
            category: string;
            isAvailable: boolean;
            stockQuantity: number;
            quantityUnit: string;
            images: { fileKey: string; displayOrder: number; altText?: string }[];
        }>;

        const imageUrls =
            body.images !== undefined
                ? [...body.images].sort((a, b) => a.displayOrder - b.displayOrder).map(img => img.fileKey)
                : (food as unknown as GetFoodByIdResponseModel).imageUrls &&
                    Array.isArray((food as unknown as GetFoodByIdResponseModel).imageUrls)
                  ? (food as unknown as GetFoodByIdResponseModel).imageUrls
                  : food.imageUrl
                    ? [food.imageUrl, food.imageUrl.replace('?w=400', '?w=800')]
                    : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'];

        const images = imageUrls.map((imageUrl, displayOrder) => ({
            fileKey: imageUrl,
            displayOrder,
            altText: undefined as string | undefined,
            imageUrl,
        }));

        const updated: GetAdminFoodDetailResponseModel = {
            id: food.id,
            name: body.name ?? food.name,
            description: body.description ?? food.description,
            price: body.price ?? food.price,
            discountPrice: body.discountPrice !== undefined ? body.discountPrice : (food.discountPrice ?? null),
            images,
            category: body.category ?? food.category,
            isAvailable: body.isAvailable ?? food.isAvailable,
            stockQuantity: body.stockQuantity ?? food.stockQuantity,
            quantityUnit: body.quantityUnit ?? food.quantityUnit,
            createdAt: food.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            categoryId: food.category,
            customisations: [],
        };

        return HttpResponse.json(updated);
    }),

    http.delete(`${buildUrl(ADMIN_ENDPOINTS.FOODS)}/:id`, async () => {
        await delay(300);
        return new HttpResponse(null, { status: 204 });
    }),
];
