import { http, HttpResponse, delay } from 'msw';

import { mockAdminUsers } from '../data/admin-users';
import { buildUrl } from '../utils';

import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';

export const adminUsersHandlers = [
    http.get(`${buildUrl(ADMIN_ENDPOINTS.USERS)}/:id`, async ({ params }) => {
        await delay(300);
        const id = params.id as string;
        const user = mockAdminUsers.find(u => u.id === id);
        if (!user) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        return HttpResponse.json(user);
    }),

    http.get(buildUrl(ADMIN_ENDPOINTS.USERS), async ({ request }) => {
        await delay(500);
        const url = new URL(request.url);
        const skip = parseInt(url.searchParams.get('skip') || '0', 10);
        const take = parseInt(url.searchParams.get('take') || '20', 10);
        const paginatedUsers = mockAdminUsers.slice(skip, skip + take);
        return HttpResponse.json({
            items: paginatedUsers,
            totalCount: mockAdminUsers.length,
        });
    }),

    http.patch(`${buildUrl(ADMIN_ENDPOINTS.USERS)}/:id`, async ({ params, request }) => {
        await delay(300);
        const id = params.id as string;
        const user = mockAdminUsers.find(u => u.id === id);
        if (!user) {
            return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        }
        const body = (await request.json()) as Partial<{
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | null;
            location: string | null;
            role: string;
        }>;
        const updated = {
            ...user,
            ...body,
            id,
        };
        return HttpResponse.json(updated);
    }),

    http.delete(`${buildUrl(ADMIN_ENDPOINTS.USERS)}/:id`, async ({ params }) => {
        await delay(300);
        const id = params.id as string;
        return HttpResponse.json({ message: `User ${id} deleted successfully` });
    }),

    http.post(`${buildUrl(ADMIN_ENDPOINTS.USERS)}/:id/reset-password`, async ({ params }) => {
        await delay(300);
        const id = params.id as string;
        return HttpResponse.json({ message: `Password reset for user ${id}` });
    }),
];
