import { http, HttpResponse, delay } from 'msw';

import { buildUrl } from '../utils';

import type { AdminOrderResponseModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import { DeliveryStatusType, PaymentStatusType } from '@/features/order';

function generateMockOrders(): AdminOrderResponseModel[] {
    const orders: AdminOrderResponseModel[] = [];
    const firstNames = [
        'John',
        'Jane',
        'Bob',
        'Alice',
        'Charlie',
        'Diana',
        'Edward',
        'Fiona',
        'George',
        'Helen',
        'Ivan',
        'Julia',
        'Kevin',
        'Laura',
        'Michael',
        'Nancy',
        'Oliver',
        'Patricia',
        'Quinn',
        'Rachel',
        'Samuel',
        'Tina',
        'Victor',
        'Wendy',
        'Xavier',
        'Yvonne',
        'Zachary',
        'Amanda',
        'Brian',
        'Catherine',
        'David',
        'Emily',
        'Frank',
        'Grace',
        'Henry',
        'Isabella',
        'Jack',
        'Karen',
        'Liam',
        'Mia',
        'Noah',
        'Olivia',
        'Paul',
        'Quinn',
        'Ryan',
        'Sophia',
        'Thomas',
        'Uma',
        'Vincent',
        'Willow',
    ];
    const lastNames = [
        'Smith',
        'Johnson',
        'Williams',
        'Brown',
        'Jones',
        'Garcia',
        'Miller',
        'Davis',
        'Rodriguez',
        'Martinez',
        'Hernandez',
        'Lopez',
        'Wilson',
        'Anderson',
        'Thomas',
        'Taylor',
        'Moore',
        'Jackson',
        'Martin',
        'Lee',
        'Thompson',
        'White',
        'Harris',
        'Sanchez',
        'Clark',
        'Ramirez',
        'Lewis',
        'Robinson',
        'Walker',
        'Young',
    ];
    const foodItems = [
        {
            name: 'Pizza Margherita',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        },
        {
            name: 'Burger Deluxe',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        },
        {
            name: 'Pasta Carbonara',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
        },
        {
            name: 'Chicken Wings',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
        },
        {
            name: 'Caesar Salad',
            price: 10.99,
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        },
        {
            name: 'Sushi Platter',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        },
        { name: 'Tacos', price: 11.99, image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6c3b?w=400' },
        {
            name: 'Ramen Bowl',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        },
    ];
    const statuses = [
        DeliveryStatusType.Placed,
        DeliveryStatusType.Preparing,
        DeliveryStatusType.OnTheWay,
        DeliveryStatusType.Delivered,
    ];
    let orderId = 1;
    const now = Date.now();
    statuses.forEach(status => {
        for (let i = 0; i < 25; i++) {
            const firstName = firstNames[(orderId - 1) % firstNames.length];
            const lastName = lastNames[(orderId - 1) % lastNames.length];
            const userName = `${firstName} ${lastName}`;
            const userEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
            const foodItem = foodItems[orderId % foodItems.length];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const totalPrice = foodItem.price * quantity;
            const totalAmount = Math.round((totalPrice + Math.random() * 5) * 100) / 100;
            let createdAt: Date;
            let updatedAt: Date;
            if (status === DeliveryStatusType.Placed) {
                createdAt = new Date(now - (Math.random() * 4 + 0.5) * 60 * 60 * 1000);
                updatedAt = createdAt;
            } else if (status === DeliveryStatusType.Preparing) {
                createdAt = new Date(now - (Math.random() * 2 + 1) * 60 * 60 * 1000);
                updatedAt = new Date(now - Math.random() * 60 * 60 * 1000);
            } else if (status === DeliveryStatusType.OnTheWay) {
                createdAt = new Date(now - (Math.random() * 2 + 2) * 60 * 60 * 1000);
                updatedAt = new Date(now - Math.random() * 60 * 60 * 1000);
            } else {
                createdAt = new Date(now - (Math.random() * 24 + 1) * 60 * 60 * 1000);
                updatedAt = new Date(now - Math.random() * 20 * 60 * 60 * 1000);
            }
            orders.push({
                id: orderId.toString(),
                slugId: `ORD-${String(orderId).padStart(3, '0')}`,
                userId: `user-${orderId}`,
                userEmail,
                userName,
                totalAmount,
                deliveryStatus: status,
                paymentStatus:
                    status === DeliveryStatusType.Delivered ? PaymentStatusType.Paid : PaymentStatusType.Unpaid,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
                totalItems: 1,
                deliveryNotes: orderId % 3 === 0 ? 'Please leave at the door.' : null,
            });
            orderId++;
        }
    });
    return orders;
}

const mockOrdersTable: AdminOrderResponseModel[] = [
    {
        id: '1',
        slugId: 'ORD-001',
        userId: 'user-1',
        userEmail: 'john.doe@example.com',
        userName: 'John Doe',
        totalAmount: 45.99,
        deliveryStatus: DeliveryStatusType.Placed,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '2',
        slugId: 'ORD-002',
        userId: 'user-2',
        userEmail: 'jane.smith@example.com',
        userName: 'Jane Smith',
        totalAmount: 32.5,
        deliveryStatus: DeliveryStatusType.Preparing,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '3',
        slugId: 'ORD-003',
        userId: 'user-3',
        userEmail: 'bob.johnson@example.com',
        userName: 'Bob Johnson',
        totalAmount: 28.75,
        deliveryStatus: DeliveryStatusType.OnTheWay,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '4',
        slugId: 'ORD-004',
        userId: 'user-4',
        userEmail: 'alice.brown@example.com',
        userName: 'Alice Brown',
        totalAmount: 19.99,
        deliveryStatus: DeliveryStatusType.Delivered,
        paymentStatus: PaymentStatusType.Paid,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '5',
        slugId: 'ORD-005',
        userId: 'user-5',
        userEmail: 'charlie.wilson@example.com',
        userName: 'Charlie Wilson',
        totalAmount: 67.45,
        deliveryStatus: DeliveryStatusType.Placed,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        totalItems: 3,
        deliveryNotes: null,
    },
    {
        id: '6',
        slugId: 'ORD-006',
        userId: 'user-6',
        userEmail: 'diana.prince@example.com',
        userName: 'Diana Prince',
        totalAmount: 42.97,
        deliveryStatus: DeliveryStatusType.Placed,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '7',
        slugId: 'ORD-007',
        userId: 'user-7',
        userEmail: 'edward.norton@example.com',
        userName: 'Edward Norton',
        totalAmount: 55.96,
        deliveryStatus: DeliveryStatusType.Preparing,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '8',
        slugId: 'ORD-008',
        userId: 'user-8',
        userEmail: 'fiona.apple@example.com',
        userName: 'Fiona Apple',
        totalAmount: 38.97,
        deliveryStatus: DeliveryStatusType.Preparing,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '9',
        slugId: 'ORD-009',
        userId: 'user-9',
        userEmail: 'george.martin@example.com',
        userName: 'George Martin',
        totalAmount: 24.98,
        deliveryStatus: DeliveryStatusType.OnTheWay,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '10',
        slugId: 'ORD-010',
        userId: 'user-10',
        userEmail: 'helen.troy@example.com',
        userName: 'Helen Troy',
        totalAmount: 51.96,
        deliveryStatus: DeliveryStatusType.OnTheWay,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '11',
        slugId: 'ORD-011',
        userId: 'user-11',
        userEmail: 'ivan.petrov@example.com',
        userName: 'Ivan Petrov',
        totalAmount: 33.97,
        deliveryStatus: DeliveryStatusType.Delivered,
        paymentStatus: PaymentStatusType.Paid,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '12',
        slugId: 'ORD-012',
        userId: 'user-12',
        userEmail: 'julia.roberts@example.com',
        userName: 'Julia Roberts',
        totalAmount: 89.94,
        deliveryStatus: DeliveryStatusType.Delivered,
        paymentStatus: PaymentStatusType.Paid,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
        totalItems: 3,
        deliveryNotes: null,
    },
    {
        id: '13',
        slugId: 'ORD-013',
        userId: 'user-13',
        userEmail: 'karen.white@example.com',
        userName: 'Karen White',
        totalAmount: 28.97,
        deliveryStatus: DeliveryStatusType.Placed,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '14',
        slugId: 'ORD-014',
        userId: 'user-14',
        userEmail: 'liam.neeson@example.com',
        userName: 'Liam Neeson',
        totalAmount: 47.96,
        deliveryStatus: DeliveryStatusType.Placed,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        totalItems: 3,
        deliveryNotes: null,
    },
    {
        id: '15',
        slugId: 'ORD-015',
        userId: 'user-15',
        userEmail: 'maria.garcia@example.com',
        userName: 'Maria Garcia',
        totalAmount: 35.97,
        deliveryStatus: DeliveryStatusType.Preparing,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '16',
        slugId: 'ORD-016',
        userId: 'user-16',
        userEmail: 'nathan.drake@example.com',
        userName: 'Nathan Drake',
        totalAmount: 61.95,
        deliveryStatus: DeliveryStatusType.Preparing,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        totalItems: 3,
        deliveryNotes: null,
    },
    {
        id: '17',
        slugId: 'ORD-017',
        userId: 'user-17',
        userEmail: 'olivia.wilde@example.com',
        userName: 'Olivia Wilde',
        totalAmount: 41.97,
        deliveryStatus: DeliveryStatusType.OnTheWay,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '18',
        slugId: 'ORD-018',
        userId: 'user-18',
        userEmail: 'peter.parker@example.com',
        userName: 'Peter Parker',
        totalAmount: 76.93,
        deliveryStatus: DeliveryStatusType.OnTheWay,
        paymentStatus: PaymentStatusType.Unpaid,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
    {
        id: '19',
        slugId: 'ORD-019',
        userId: 'user-19',
        userEmail: 'quinn.fabray@example.com',
        userName: 'Quinn Fabray',
        totalAmount: 27.98,
        deliveryStatus: DeliveryStatusType.Delivered,
        paymentStatus: PaymentStatusType.Paid,
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        totalItems: 1,
        deliveryNotes: null,
    },
    {
        id: '20',
        slugId: 'ORD-020',
        userId: 'user-20',
        userEmail: 'rachel.green@example.com',
        userName: 'Rachel Green',
        totalAmount: 44.97,
        deliveryStatus: DeliveryStatusType.Delivered,
        paymentStatus: PaymentStatusType.Paid,
        createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
        totalItems: 2,
        deliveryNotes: null,
    },
];

export const adminOrdersHandlers = [
    http.get(`${buildUrl(ADMIN_ENDPOINTS.ORDERS)}/table`, async ({ request }) => {
        await delay(500);
        const url = new URL(request.url);
        const skip = parseInt(url.searchParams.get('skip') || '0', 10);
        const take = parseInt(url.searchParams.get('take') || '20', 10);
        const paginatedOrders = mockOrdersTable.slice(skip, skip + take);
        const totalCount = mockOrdersTable.length;
        return HttpResponse.json({ items: paginatedOrders, totalCount });
    }),

    http.get(`${buildUrl(ADMIN_ENDPOINTS.ORDERS)}/kanban`, async ({ request }) => {
        await delay(500);
        const url = new URL(request.url);
        const status = url.searchParams.get('status') || '';
        const skip = parseInt(url.searchParams.get('skip') || '0', 10);
        const take = parseInt(url.searchParams.get('take') || '20', 10);
        const allOrders = generateMockOrders();
        const filteredOrders = status ? allOrders.filter(order => order.deliveryStatus === status) : allOrders;
        const paginatedOrders = filteredOrders.slice(skip, skip + take);
        return HttpResponse.json({ items: paginatedOrders, totalCount: filteredOrders.length });
    }),

    http.patch(`${buildUrl(ADMIN_ENDPOINTS.ORDERS)}/:id/delivery-status`, async ({ params, request }) => {
        await delay(300);
        const id = params.id as string;
        const body = (await request.json()) as { deliveryStatus: string };
        const mockOrder: AdminOrderResponseModel = {
            id,
            slugId: 'ORD-001',
            userId: 'user-1',
            userEmail: 'john.doe@example.com',
            userName: 'John Doe',
            totalAmount: 45.99,
            deliveryStatus: body.deliveryStatus,
            paymentStatus: PaymentStatusType.Paid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalItems: 0,
            deliveryNotes: null,
        };
        return HttpResponse.json(mockOrder);
    }),
];
