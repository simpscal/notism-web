import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    CheckCircle2,
    Eye,
    Grid3x3,
    LayoutDashboard,
    LayoutGrid,
    MoreVertical,
    Package,
    Radio,
    Receipt,
    Search,
    StickyNote,
    Tags,
    Truck,
    Users,
    UtensilsCrossed,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import Kanban, { type KanbanColumn } from '@/components/kanban';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import Spinner from '@/components/spinner';
import {
    SortableTableHead,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    useTableSort,
} from '@/components/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface — Admin Order Management (/admin/orders), restyled on-theme.
//
// Business behaviour is UNCHANGED from the live surface (src/pages/admin/orders):
//   • two interchangeable views of the SAME order set — a status kanban board
//     and a paginated table — switched by a single-select view toggle;
//   • a single-select payment-status filter narrowing both views;
//   • each order's delivery state shown as a WORD label with one consistent
//     status colour in BOTH views;
//   • row/card actions (open order, change status) preserved as-is.
//
// This story only RESTYLES visuals + density to DESIGN_THEME.md:
//   • dark ambient frame → one large rounded light shell holding the board;
//   • price / total is the single crimson emphasis (never spread to controls);
//   • view toggle + payment filter read as on-theme single-select controls,
//     exactly one selection each;
//   • admin table density tightened for scan volume, tap targets ≥ 36px;
//   • status colour reserved for status, always paired with a word label.
//
// Self-contained: composed only from @/components/* + mock fixtures. No
// api/model/state/page imports; no drag mutations (board is presentational).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock domain shapes — mirror the live AdminOrderModel fields the views read.
// ---------------------------------------------------------------------------

type DeliveryStatusKey = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered';
type PaymentStatusKey = 'paid' | 'unpaid' | 'failed' | 'refunded';

interface OrderRow {
    id: string;
    slugId: string;
    userName: string;
    userEmail: string;
    totalAmount: number;
    totalItems: number;
    deliveryStatus: DeliveryStatusKey;
    paymentStatus: PaymentStatusKey;
    deliveryNotes: string | null;
}

// ---------------------------------------------------------------------------
// Status roles — status colour reserved for status, ALWAYS with a word label
// (DESIGN_THEME "Do show order status in words and a consistent color"). One
// consistent colour per state, shared by BOTH the table and the kanban card so
// a state reads identically across views. Crimson (primary) is deliberately
// kept OFF status chips — it is reserved here for price emphasis only.
// ---------------------------------------------------------------------------

const DELIVERY_STATUS: {
    key: DeliveryStatusKey;
    label: string;
    icon: typeof Package;
    chipClass: string;
}[] = [
    {
        key: 'orderPlaced',
        label: 'Order placed',
        icon: CheckCircle2,
        chipClass: 'bg-secondary text-secondary-foreground border-transparent',
    },
    {
        key: 'preparing',
        label: 'Preparing',
        icon: Package,
        chipClass: 'bg-warning/15 text-warning border-warning/30',
    },
    {
        key: 'onTheWay',
        label: 'On the way',
        icon: Truck,
        chipClass: 'bg-info/15 text-info border-info/30',
    },
    {
        key: 'delivered',
        label: 'Delivered',
        icon: CheckCircle2,
        chipClass: 'bg-success/15 text-success border-success/30',
    },
];

const DELIVERY_BY_KEY = Object.fromEntries(DELIVERY_STATUS.map(s => [s.key, s]));

/** Delivery-status word label + consistent status colour, shared across views. */
function DeliveryStatusPill({ status }: { status: DeliveryStatusKey }) {
    const config = DELIVERY_BY_KEY[status];
    const Icon = config.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.chipClass}`}
        >
            <Icon className='h-3.5 w-3.5' aria-hidden />
            {config.label}
        </span>
    );
}

// Payment-status roles — a WORD label + one consistent colour per state, never
// colour alone. Crimson stays OFF payment status too (reserved for price): a
// "Failed" payment reads amber-urgent, not red, so price remains the one red.
const PAYMENT_STATUS: Record<PaymentStatusKey, { label: string; chipClass: string }> = {
    paid: { label: 'Paid', chipClass: 'bg-success/15 text-success border-success/30' },
    unpaid: { label: 'Unpaid', chipClass: 'bg-secondary text-secondary-foreground border-transparent' },
    refunded: { label: 'Refunded', chipClass: 'bg-info/15 text-info border-info/30' },
    failed: { label: 'Failed', chipClass: 'bg-warning/15 text-warning border-warning/30' },
};

/** Payment-status word label + one consistent colour per state. */
function PaymentStatusPill({ status }: { status: PaymentStatusKey }) {
    const config = PAYMENT_STATUS[status];
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.chipClass}`}
        >
            {config.label}
        </span>
    );
}

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Fixtures — order ids / totals follow the app's slug + VND conventions.
// ---------------------------------------------------------------------------

const ORDERS: OrderRow[] = [
    {
        id: 'o-1',
        slugId: '20260704-1042',
        userName: 'Linh Nguyen',
        userEmail: 'linh.nguyen@example.com',
        totalAmount: 285000,
        totalItems: 3,
        deliveryStatus: 'orderPlaced',
        paymentStatus: 'paid',
        deliveryNotes: 'Ring the bell twice, leave at the door.',
    },
    {
        id: 'o-2',
        slugId: '20260704-1043',
        userName: 'Minh Tran',
        userEmail: 'minh.tran@example.com',
        totalAmount: 95000,
        totalItems: 1,
        deliveryStatus: 'orderPlaced',
        paymentStatus: 'unpaid',
        deliveryNotes: null,
    },
    {
        id: 'o-3',
        slugId: '20260704-1044',
        userName: 'Hoa Pham',
        userEmail: 'hoa.pham@example.com',
        totalAmount: 612000,
        totalItems: 5,
        deliveryStatus: 'preparing',
        paymentStatus: 'paid',
        deliveryNotes: 'Extra chilli on the side.',
    },
    {
        id: 'o-4',
        slugId: '20260704-1045',
        userName: 'Anh Le',
        userEmail: 'anh.le@example.com',
        totalAmount: 178000,
        totalItems: 2,
        deliveryStatus: 'preparing',
        paymentStatus: 'paid',
        deliveryNotes: null,
    },
    {
        id: 'o-5',
        slugId: '20260704-1046',
        userName: 'Duc Vo',
        userEmail: 'duc.vo@example.com',
        totalAmount: 340000,
        totalItems: 4,
        deliveryStatus: 'onTheWay',
        paymentStatus: 'paid',
        deliveryNotes: 'Call on arrival — gate code 4821.',
    },
    {
        id: 'o-6',
        slugId: '20260704-1047',
        userName: 'Thu Dang',
        userEmail: 'thu.dang@example.com',
        totalAmount: 129000,
        totalItems: 1,
        deliveryStatus: 'onTheWay',
        paymentStatus: 'refunded',
        deliveryNotes: null,
    },
    {
        id: 'o-7',
        slugId: '20260704-1048',
        userName: 'Bao Hoang',
        userEmail: 'bao.hoang@example.com',
        totalAmount: 458000,
        totalItems: 6,
        deliveryStatus: 'delivered',
        paymentStatus: 'paid',
        deliveryNotes: null,
    },
    {
        id: 'o-8',
        slugId: '20260704-1049',
        userName: 'Mai Do',
        userEmail: 'mai.do@example.com',
        totalAmount: 88000,
        totalItems: 1,
        deliveryStatus: 'delivered',
        paymentStatus: 'failed',
        deliveryNotes: 'Reorder — first attempt payment failed.',
    },
];

const PAYMENT_FILTER_OPTIONS: { value: string; label: string }[] = [
    { value: 'all', label: 'All payments' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
];

// ---------------------------------------------------------------------------
// Order card — the kanban board item (mirrors admin-order-card). Price is the
// one crimson emphasis; the delivery state rides in the column, payment status
// carries its own word chip.
// ---------------------------------------------------------------------------

function OrderCard({ order }: { order: OrderRow }) {
    return (
        <Card className='cursor-pointer rounded-2xl border-border/70 transition-colors hover:border-foreground/25'>
            <CardContent className='space-y-2.5 p-4'>
                <div className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-bold tracking-tight text-foreground'>#{order.slugId}</span>
                    {/* Price — the single crimson emphasis on the card. */}
                    <span className='text-sm font-bold text-primary'>{formatVnd(order.totalAmount)}</span>
                </div>
                {/* Delivery + payment states — word label + consistent status colour,
                    identical to the table so a state reads the same across both views. */}
                <div className='flex flex-wrap items-center gap-1.5'>
                    <DeliveryStatusPill status={order.deliveryStatus} />
                    <PaymentStatusPill status={order.paymentStatus} />
                </div>
                <div className='text-xs text-muted-foreground'>
                    <div className='font-medium text-foreground'>{order.userName}</div>
                    <div className='truncate'>{order.userEmail}</div>
                </div>
                <div className='text-xs text-muted-foreground'>
                    {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}
                </div>
                {order.deliveryNotes && (
                    <div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
                        <StickyNote className='mt-0.5 h-3 w-3 shrink-0' aria-hidden />
                        <span className='line-clamp-2'>{order.deliveryNotes}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Board header — page title + the two on-theme single-select controls, both the
// shared segmented ToggleGroup: the payment-status filter and the view toggle.
// Neither uses a Button to signal the active choice — the active segment is the
// ink fill (bg-selected) the segmented variant provides, keeping crimson
// reserved for price. Exactly one selection each (deselect is guarded away).
// ---------------------------------------------------------------------------

type ViewMode = 'kanban' | 'grid';

/**
 * Payment-status filter — shared ToggleGroup, segmented variant. Single-select,
 * active segment = ink fill; no Button carries the selected state.
 */
function PaymentFilterToggle({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
    return (
        <ToggleGroup
            type='single'
            value={value}
            onValueChange={next => next && onValueChange(next)}
            variant='segmented'
            aria-label='Filter by payment status'
        >
            {PAYMENT_FILTER_OPTIONS.map(option => (
                <ToggleGroupItem key={option.value} value={option.value} className='h-9 px-4 text-sm font-semibold'>
                    {option.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

function BoardHeader({
    viewMode,
    onViewModeChange,
    paymentFilter,
    onPaymentFilterChange,
}: {
    viewMode: ViewMode;
    onViewModeChange: (value: ViewMode) => void;
    paymentFilter: string;
    onPaymentFilterChange: (value: string) => void;
}) {
    return (
        <div className='flex shrink-0 flex-wrap items-end justify-between gap-4'>
            <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>Kitchen</p>
                <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground'>Orders</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    Track and move every order through the kitchen at a glance.
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
                <PaymentFilterToggle value={paymentFilter} onValueChange={onPaymentFilterChange} />

                {/* View toggle — same shared segmented ToggleGroup, active segment = ink fill. */}
                <ToggleGroup
                    type='single'
                    value={viewMode}
                    onValueChange={value => value && onViewModeChange(value as ViewMode)}
                    variant='segmented'
                    aria-label='Switch board view'
                >
                    <ToggleGroupItem
                        value='kanban'
                        aria-label='Kanban view'
                        className='h-9 gap-1.5 px-3.5 font-semibold'
                    >
                        <LayoutGrid className='h-4 w-4' aria-hidden />
                        Board
                    </ToggleGroupItem>
                    <ToggleGroupItem value='grid' aria-label='Table view' className='h-9 gap-1.5 px-3.5 font-semibold'>
                        <Grid3x3 className='h-4 w-4' aria-hidden />
                        Table
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Table view — scannable rows, tightened admin density, tap targets ≥ 36px.
// Delivery state → word pill; price → crimson; row actions preserved.
// ---------------------------------------------------------------------------

function OrdersTableView({ orders }: { orders: OrderRow[] }) {
    const { sortBy, sortOrder, handleSort } = useTableSort<string>();

    return (
        <div className='flex min-h-0 flex-1 flex-col gap-4'>
            <div className='max-w-md shrink-0'>
                <InputGroup className='rounded-full'>
                    <InputGroupInput type='text' placeholder='Search orders by id, name or email' />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Table scrolls independently — vertical for row volume, horizontal
                for the wide admin table — inside its own hairline container. */}
            <div className='min-h-0 flex-1 overflow-auto rounded-2xl border border-border/70'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableTableHead
                                field='slugId'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[130px]'
                            >
                                Order
                            </SortableTableHead>
                            <SortableTableHead
                                field='userName'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[150px]'
                            >
                                Customer
                            </SortableTableHead>
                            <TableHead className='min-w-[200px]'>Email</TableHead>
                            <SortableTableHead
                                field='totalAmount'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[110px]'
                            >
                                Total
                            </SortableTableHead>
                            <TableHead className='min-w-[70px]'>Items</TableHead>
                            <SortableTableHead
                                field='deliveryStatus'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[150px]'
                            >
                                Status
                            </SortableTableHead>
                            <TableHead className='min-w-[110px]'>Payment</TableHead>
                            <TableHead className='min-w-[70px] text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <span className='font-semibold text-foreground'>#{order.slugId}</span>
                                    </TableCell>
                                    <TableCell className='font-medium text-foreground'>{order.userName}</TableCell>
                                    <TableCell className='text-muted-foreground'>{order.userEmail}</TableCell>
                                    {/* Price — the single crimson emphasis in the row. */}
                                    <TableCell className='font-bold text-primary'>
                                        {formatVnd(order.totalAmount)}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>{order.totalItems}</TableCell>
                                    <TableCell>
                                        <DeliveryStatusPill status={order.deliveryStatus} />
                                    </TableCell>
                                    <TableCell>
                                        <PaymentStatusPill status={order.paymentStatus} />
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon-sm'>
                                                    <MoreVertical className='h-4 w-4' />
                                                    <span className='sr-only'>Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem>
                                                    <Eye className='h-4 w-4' />
                                                    View order
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className='py-16 text-center text-muted-foreground'>
                                    No orders match this filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Kanban view — a status column per delivery state; the column IS the state
// label (word), cards ride within. Same order set, same status roles.
// ---------------------------------------------------------------------------

function OrdersKanbanView({ orders }: { orders: OrderRow[] }) {
    const columns: KanbanColumn<OrderRow>[] = DELIVERY_STATUS.map(status => {
        const items = orders.filter(o => o.deliveryStatus === status.key);
        return { id: status.key, title: status.label, items, totalCount: items.length };
    });

    return (
        <div className='min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/70'>
            <Kanban columns={columns} renderItem={order => <OrderCard order={order} />} getItemId={order => order.id} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Admin toolbar — the shared, domain-blind NavBar (variant="admin"), matching
// sibling AdminAppShell.stories.tsx: brand + Admin badge (left) · admin nav
// (centre, NavBarNav/NavBarItem — the active route is a real navigation
// selection via aria-current, rendered as the variant's ink active pill, never
// a Button in a selected style) · live-feed indicator + account (right). Given
// the floating-shell aesthetic, the bar is composed rounded/floating over the
// gray shell via additive className; its selection + colour roles are the
// component's own. Red stays reserved for price.
// ---------------------------------------------------------------------------

const ADMIN_NAV: { key: string; label: string; icon: LucideIcon }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'refunds', label: 'Refunds', icon: Receipt },
    { key: 'foods', label: 'Foods', icon: UtensilsCrossed },
    { key: 'categories', label: 'Categories', icon: Tags },
    { key: 'users', label: 'Users', icon: Users },
];

function AdminToolbar({ activePage = 'orders' }: { activePage?: string }) {
    return (
        <NavBar
            variant='admin'
            className='h-16 shrink-0 rounded-full border-b-0 px-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:px-4'
        >
            {/* Left — brand + Admin badge */}
            <NavBarBrand className='pl-1'>
                <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </NavBarBrand>

            {/* Centre — admin nav; active route = ink pill via aria-current, never a Button */}
            <NavBarNav className='flex-1 justify-center'>
                {ADMIN_NAV.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem key={item.key} active={item.key === activePage}>
                            <Icon className='h-4 w-4' aria-hidden />
                            <span className='hidden lg:inline'>{item.label}</span>
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            {/* Right — live feed + account */}
            <NavBarActions className='gap-3'>
                <span className='hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success sm:inline-flex'>
                    <Radio className='h-3.5 w-3.5' aria-hidden />
                    Live orders on
                </span>
                <Avatar className='h-8 w-8 border border-border/60'>
                    <AvatarFallback className='bg-secondary text-xs font-semibold text-foreground'>AD</AvatarFallback>
                </Avatar>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Shell — soft, minimal elevation, one gentle step per level (no heavy
// rings/shadows): dark ambient frame → one large-radius light-gray shell →
// white content panel (hairline + faint shadow) → white table/kanban cards
// (hairline, little/no shadow). The shell fills the viewport; the floating
// toolbar is pinned while the orders board scrolls independently within it.
// min-h / flex throughout — no fixed heights.
// ---------------------------------------------------------------------------

function OrdersShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col bg-frame p-3 sm:p-5'>
            {/* Light-gray shell — the one large rounded surface holding chrome + content. */}
            <div className='mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col gap-3 rounded-[2rem] bg-secondary p-3 sm:gap-4 sm:p-4'>
                <AdminToolbar />

                {/* White content panel — hairline + single soft shadow; the board scrolls inside it. */}
                <div className='flex min-h-0 flex-1 flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-6'>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Orders surface — stateful harness wiring the view toggle + payment filter to
// the two views, exactly as the live page does.
// ---------------------------------------------------------------------------

function AdminOrderManagement({
    initialView = 'kanban',
    initialPaymentFilter = 'all',
}: {
    initialView?: ViewMode;
    initialPaymentFilter?: string;
}) {
    const [viewMode, setViewMode] = React.useState<ViewMode>(initialView);
    const [paymentFilter, setPaymentFilter] = React.useState<string>(initialPaymentFilter);

    const orders = paymentFilter === 'all' ? ORDERS : ORDERS.filter(o => o.paymentStatus === paymentFilter);

    return (
        <OrdersShell>
            <BoardHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                paymentFilter={paymentFilter}
                onPaymentFilterChange={setPaymentFilter}
            />
            {viewMode === 'kanban' ? <OrdersKanbanView orders={orders} /> : <OrdersTableView orders={orders} />}
        </OrdersShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin Order Management',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Table view — the paginated, scannable order table on-theme: tightened admin
 * density, tap targets ≥ 36px, price in crimson, each delivery state a word
 * pill with its consistent colour. Payment filter = All, view toggle = Table.
 */
export const TableView: Story = {
    name: 'Default — Table View',
    render: () => <AdminOrderManagement initialView='grid' />,
};

/**
 * Kanban view — the same order set as a status board: one column per delivery
 * state (the column header is the word label), cards carry price + payment.
 * Payment filter = All, view toggle = Board.
 */
export const KanbanView: Story = {
    name: 'Kanban View',
    render: () => <AdminOrderManagement initialView='kanban' />,
};

/**
 * Filter applied — the single-select payment-status filter set to "Paid"
 * narrows the table to paid orders only; exactly one selection on the filter
 * and one on the view toggle.
 */
export const FilterApplied: Story = {
    name: 'Partial — Payment Filter Applied (Paid)',
    render: () => <AdminOrderManagement initialView='grid' initialPaymentFilter='paid' />,
};

/**
 * Empty — the filter matches no orders: the table shows a single quiet empty
 * row rather than a dead end, controls remain in place to widen the filter.
 */
export const Empty: Story = {
    name: 'Empty — No Orders Match Filter',
    render: () => {
        function EmptyHarness() {
            const [paymentFilter, setPaymentFilter] = React.useState('unpaid');
            const orders = ORDERS.filter(o => o.paymentStatus === paymentFilter && o.deliveryStatus === 'delivered');
            return (
                <OrdersShell>
                    <BoardHeader
                        viewMode='grid'
                        onViewModeChange={() => undefined}
                        paymentFilter={paymentFilter}
                        onPaymentFilterChange={setPaymentFilter}
                    />
                    <OrdersTableView orders={orders} />
                </OrdersShell>
            );
        }
        return <EmptyHarness />;
    },
};

/**
 * Loading — the board is fetching orders: a centred spinner sits in the content
 * zone while the shell chrome and controls stay put.
 */
export const Loading: Story = {
    name: 'Loading — Fetching Orders',
    render: () => (
        <OrdersShell>
            <BoardHeader
                viewMode='kanban'
                onViewModeChange={() => undefined}
                paymentFilter='all'
                onPaymentFilterChange={() => undefined}
            />
            <div className='flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-border/70'>
                <Spinner size='lg' />
            </div>
        </OrdersShell>
    ),
};
