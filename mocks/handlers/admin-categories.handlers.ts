import { http, HttpResponse, delay } from 'msw';

import categoriesData from '../data/categories.json';
import { buildUrl } from '../utils';

import type { AdminCategoryResponseModel, GetAdminCategoriesResponseModel } from '@/apis';
import { API_ENDPOINTS } from '@/app/constants';

let categories: AdminCategoryResponseModel[] = JSON.parse(JSON.stringify(categoriesData));

function resetCategories() {
    categories = JSON.parse(JSON.stringify(categoriesData));
}

export const adminCategoriesHandlers = [
    http.get(buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES), async () => {
        await delay(300);

        const response: GetAdminCategoriesResponseModel = {
            items: categories,
        };
        return HttpResponse.json(response);
    }),

    http.get(`${buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES)}/:id`, async ({ params }) => {
        await delay(200);

        const id = params.id as string;
        const category = categories.find(c => c.id === id);

        if (!category) {
            return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return HttpResponse.json(category);
    }),

    http.post(buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES), async ({ request }) => {
        await delay(300);

        const body = (await request.json()) as { name: string };
        const id = body.name.toLowerCase().replace(/\s+/g, '-');
        const existing = categories.find(c => c.id === id || c.name.toLowerCase() === body.name.toLowerCase());
        if (existing) {
            return HttpResponse.json({ message: 'Category with this name already exists' }, { status: 409 });
        }

        const newCategory: AdminCategoryResponseModel = { id, name: body.name };
        categories.push(newCategory);
        return HttpResponse.json(newCategory, { status: 201 });
    }),

    http.patch(`${buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES)}/:id`, async ({ params, request }) => {
        await delay(300);

        const id = params.id as string;
        const body = (await request.json()) as { name: string };
        const index = categories.findIndex(c => c.id === id);

        if (index === -1) {
            return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        const duplicate = categories.find(c => c.id !== id && c.name.toLowerCase() === body.name.toLowerCase());
        if (duplicate) {
            return HttpResponse.json({ message: 'Category with this name already exists' }, { status: 409 });
        }

        categories[index] = { ...categories[index], name: body.name };
        return HttpResponse.json(categories[index]);
    }),

    http.delete(`${buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES)}/:id`, async ({ params }) => {
        await delay(300);

        const id = params.id as string;
        const index = categories.findIndex(c => c.id === id);

        if (index === -1) {
            return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        categories.splice(index, 1);
        return new HttpResponse(null, { status: 204 });
    }),
];

export { resetCategories };
