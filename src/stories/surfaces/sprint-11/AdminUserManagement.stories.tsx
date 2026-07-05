import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, ChefHat, LayoutDashboard, MoreVertical, Package, Radio, Search, Trash2, Users } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import ErrorState from '@/components/error-state';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import {
    SortableTableHead,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TablePagination,
    TableRow,
    useTableSort,
} from '@/components/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface: Admin User Management — restyle-only (sprint 11).
//
// Conformed to DESIGN_THEME.md. Admin CRUD surface; functionality unchanged:
//   • /admin/users — users list: on-theme sortable table + search + pagination
//     + per-row destructive delete (behind a dropdown, apart from any primary).
//   • /admin/users/:id — user editor: single-column form, labels above fields,
//     role as a Segmented Choice pill control (single-select, active = black
//     fill), a BLACK structural Save primary, and a destructive Delete set apart.
//   • Delete confirm — explicit confirm dialog; the one irreversible red action.
//
// Two-tone hierarchy (§1): black = primary structural actions (Save, active
// role chip); this surface carries no prices, so red is reserved for urgency —
// destructive delete only. Elevation (§4): dark ambient frame → one large-radius
// light shell → white content/table containers (hairline), a single soft shadow
// on floating chrome (toolbar, dialog) only, one gentle step per level.
// Layout (§6): admin sortable table + search + pagination; single-column editor
// with labels above fields. States (§8): hover darkens, disabled reads as
// ink-tertiary on bg-subtle, destructive stays apart behind an explicit confirm.
// Mock-only fixtures; no api / model / store / page imports.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shape (mock only — mirrors the users surface data, not the real model)
// ---------------------------------------------------------------------------

type Role = 'admin' | 'user';

interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    location: string | null;
    role: Role;
    createdAt: string;
}

const USERS: AdminUser[] = [
    {
        id: 'usr-1001',
        firstName: 'Mai',
        lastName: 'Nguyen',
        email: 'mai.nguyen@notism.app',
        phoneNumber: '(028) 391-2245',
        location: 'District 1, HCMC',
        role: 'admin',
        createdAt: '12 Jan 2026, 09:14',
    },
    {
        id: 'usr-1002',
        firstName: 'Tuan',
        lastName: 'Pham',
        email: 'tuan.pham@notism.app',
        phoneNumber: '(028) 774-1180',
        location: 'District 3, HCMC',
        role: 'user',
        createdAt: '03 Feb 2026, 16:40',
    },
    {
        id: 'usr-1003',
        firstName: 'Linh',
        lastName: 'Tran',
        email: 'linh.tran@notism.app',
        phoneNumber: null,
        location: 'Thu Duc City',
        role: 'user',
        createdAt: '21 Feb 2026, 11:02',
    },
    {
        id: 'usr-1004',
        firstName: 'Bao',
        lastName: 'Le',
        email: 'bao.le@notism.app',
        phoneNumber: '(028) 220-9931',
        location: null,
        role: 'user',
        createdAt: '08 Mar 2026, 08:25',
    },
    {
        id: 'usr-1005',
        firstName: 'Ha',
        lastName: 'Vo',
        email: 'ha.vo@notism.app',
        phoneNumber: '(028) 615-3374',
        location: 'District 7, HCMC',
        role: 'admin',
        createdAt: '19 Mar 2026, 13:57',
    },
];

// The signed-in admin — their own row hides the delete action (mirrors source).
const CURRENT_USER_ID = 'usr-1001';

// ---------------------------------------------------------------------------
// Floating admin toolbar — reference-style chrome (not a placeholder): a
// large-radius rounded bar floating INSIDE the shell, white over the light-gray
// shell, one single soft shadow (floating chrome). Brand left · admin nav centre
// (active = solid black pill + white icon/label, §5 Navigation Tabs) ·
// live-feed + account right. No order sidebar for admin. Condensed on mobile,
// never full-bleed.
// ---------------------------------------------------------------------------

const ADMIN_NAV: { key: string; label: string; icon: typeof Users; active?: boolean }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'users', label: 'Users', icon: Users, active: true },
];

function AdminToolbar() {
    return (
        <nav className='flex shrink-0 items-center justify-between gap-3 rounded-full border border-border/60 bg-card px-3 py-2 shadow-sm sm:px-4'>
            {/* Brand — mark + wordmark carry the accent RED as identity (theme §2); nav pills stay black. */}
            <div className='flex items-center gap-2 pl-1 pr-2'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                    <ChefHat className='h-4 w-4' aria-hidden />
                </span>
                <span className='hidden text-base font-bold tracking-tight text-primary sm:inline'>Notism</span>
            </div>

            {/* Admin nav — centre; active = solid black pill + white icon/label (§5). */}
            <div className='flex items-center gap-1'>
                {ADMIN_NAV.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.key}
                            type='button'
                            aria-current={item.active ? 'page' : undefined}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                                item.active
                                    ? 'bg-background text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Icon className='h-4 w-4' aria-hidden />
                            <span className='hidden lg:inline'>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Live-feed + account — right. */}
            <div className='flex items-center gap-2 pr-1'>
                <span className='hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:inline-flex'>
                    <Radio className='h-3.5 w-3.5 text-success' aria-hidden />
                    Live feed
                </span>
                <Avatar className='h-8 w-8 border border-border/60'>
                    <AvatarFallback className='bg-secondary text-xs font-semibold text-foreground'>MN</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}

// ---------------------------------------------------------------------------
// Shell — soft, minimal elevation, one gentle step per level (no heavy
// rings/shadows): dark ambient frame → one large-radius light-gray shell →
// white content panels (hairline) → white table container (hairline). The shell
// fills the viewport; the floating toolbar stays pinned while the body scrolls
// independently within it. min-h / flex throughout — no fixed heights.
// ---------------------------------------------------------------------------

function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col bg-frame p-3 sm:p-5'>
            {/* Light-gray shell — the one large rounded surface holding chrome + content. */}
            <div className='mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col gap-3 rounded-[2rem] bg-secondary p-3 sm:gap-4 sm:p-4'>
                <AdminToolbar />
                {/* Content zone — scrolls within the shell; toolbar stays pinned. */}
                <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Users list surface — on-theme sortable table + search + pagination.
//
// Admin volume → a TABLE (theme: cards for consumers, tables for admin). Rows
// tighten for scanning but keep accessible targets. Delete lives behind a
// per-row dropdown, set apart from any primary action, and opens a confirm.
// ---------------------------------------------------------------------------

const PAGE_SIZE = 5;

function UsersListSurface({
    users = USERS,
    onRequestDelete,
}: {
    users?: AdminUser[];
    onRequestDelete?: (user: AdminUser) => void;
}) {
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const { sortBy, sortOrder, handleSort } = useTableSort<string>(() => setPage(1));

    const filtered = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            [u.firstName, u.lastName, u.email, u.location ?? ''].some(v => v.toLowerCase().includes(q))
        );
    }, [users, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        // White content panel — hairline; one gentle step above the light shell.
        <div className='rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm sm:p-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight text-foreground'>User management</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    View and manage staff and customer accounts across the restaurant.
                </p>
            </div>

            {/* Search — one rounded input, fully on-theme. */}
            <div className='mb-4 mt-6 max-w-md'>
                <InputGroup>
                    <InputGroupInput
                        type='text'
                        placeholder='Search by name, email or location'
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Users table — white container, hairline, little/no shadow; the
                wide table scrolls horizontally within its own container. */}
            <div className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableTableHead
                                field='firstName'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[120px]'
                            >
                                First name
                            </SortableTableHead>
                            <SortableTableHead
                                field='lastName'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[120px]'
                            >
                                Last name
                            </SortableTableHead>
                            <SortableTableHead
                                field='email'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[200px]'
                            >
                                Email
                            </SortableTableHead>
                            <TableHead className='min-w-[140px]'>Phone number</TableHead>
                            <TableHead className='min-w-[150px]'>Location</TableHead>
                            <SortableTableHead
                                field='role'
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                className='min-w-[100px]'
                            >
                                Role
                            </SortableTableHead>
                            <TableHead className='min-w-[80px] text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageItems.length > 0 ? (
                            pageItems.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className='font-medium'>
                                        <span className='text-foreground underline-offset-4 hover:underline'>
                                            {user.firstName}
                                        </span>
                                    </TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell className='text-muted-foreground'>{user.email}</TableCell>
                                    <TableCell className='text-muted-foreground'>{user.phoneNumber ?? '-'}</TableCell>
                                    <TableCell className='text-muted-foreground'>{user.location ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'admin' ? 'secondary' : 'outline'}
                                            className='capitalize'
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {user.id !== CURRENT_USER_ID ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon-sm' className='h-8 w-8'>
                                                        <MoreVertical className='h-4 w-4' />
                                                        <span className='sr-only'>Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem
                                                        variant='destructive'
                                                        onClick={() => onRequestDelete?.(user)}
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <span className='text-muted-foreground'>-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className='py-16 text-center text-muted-foreground'>
                                    No users match your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// User editor surface — single-column form, labels above fields, role as a
// Segmented Choice pill control (single-select, active = solid black fill).
// Save is the single BLACK structural primary; Delete is destructive and set
// apart from it (theme §8: never adjacent, always confirmed).
// ---------------------------------------------------------------------------

const ROLE_OPTIONS: { value: Role; label: string }[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
];

function UserEditorSurface({
    user,
    onRequestDelete,
    roleError,
}: {
    user: AdminUser;
    onRequestDelete?: (user: AdminUser) => void;
    roleError?: string;
}) {
    const [role, setRole] = React.useState<Role>(user.role);
    const isDirty = role !== user.role;

    return (
        // Single column, max ~36rem (theme: form/checkout pattern).
        <div className='mx-auto max-w-xl py-1'>
            <Button variant='ghost' className='mb-4 -ml-2'>
                <ArrowLeft className='h-4 w-4' />
                Back to users
            </Button>

            <Card className='rounded-[1.75rem] border-border/60 shadow-sm'>
                <CardHeader>
                    <CardTitle className='text-xl'>{`${user.firstName} ${user.lastName}`}</CardTitle>
                    <CardDescription>View account information and set this member's role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='space-y-6' onSubmit={e => e.preventDefault()}>
                        {/* Read-only account facts, quiet body rows. */}
                        <div className='space-y-2'>
                            {[
                                { label: 'First name', value: user.firstName },
                                { label: 'Last name', value: user.lastName },
                                { label: 'Email', value: user.email },
                                { label: 'Phone number', value: user.phoneNumber ?? '-' },
                                { label: 'Location', value: user.location ?? '-' },
                            ].map((row, i, arr) => (
                                <React.Fragment key={row.label}>
                                    <div className='flex justify-between gap-4 text-sm'>
                                        <span className='text-muted-foreground'>{row.label}</span>
                                        <span className='font-medium text-foreground'>{row.value}</span>
                                    </div>
                                    {i < arr.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Role — Segmented Choice, label above; active = solid black fill. */}
                        <Field data-invalid={roleError ? true : undefined}>
                            <FieldLabel htmlFor='role-toggle'>Role</FieldLabel>
                            <ToggleGroup
                                id='role-toggle'
                                type='single'
                                value={role}
                                onValueChange={val => val && setRole(val as Role)}
                                className='w-full gap-2'
                            >
                                {ROLE_OPTIONS.map(opt => (
                                    <ToggleGroupItem
                                        key={opt.value}
                                        value={opt.value}
                                        aria-label={opt.label}
                                        className='flex-1 rounded-full border border-border px-5 first:rounded-l-full last:rounded-r-full data-[state=off]:bg-card'
                                    >
                                        {opt.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                            <FieldDescription>Admins can manage orders, menu and other accounts.</FieldDescription>
                            {roleError && <FieldError>{roleError}</FieldError>}
                        </Field>

                        <div className='text-sm text-muted-foreground'>Created {user.createdAt}</div>

                        {/* Action hierarchy: one BLACK structural primary; destructive set apart. */}
                        <div className='flex items-center justify-between gap-4 pt-2'>
                            <Button
                                type='submit'
                                disabled={!isDirty}
                                className='bg-selected text-selected-foreground hover:bg-selected/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100'
                            >
                                Save changes
                            </Button>
                            <Button type='button' variant='destructive' onClick={() => onRequestDelete?.(user)}>
                                <Trash2 className='h-4 w-4' />
                                Delete user
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Delete confirm — explicit confirm dialog; the one irreversible red action on
// the surface. Cancel (idle outline) and Delete (destructive) are the only
// footer actions; the destructive action is never adjacent to a primary.
// ---------------------------------------------------------------------------

function DeleteConfirmDialog({
    open,
    user,
    onOpenChange,
    onConfirm,
    isDeleting,
}: {
    open: boolean;
    user: AdminUser | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting?: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete user</DialogTitle>
                    <DialogDescription>This permanently removes {user?.email}. This can't be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant='destructive' onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Interactive harnesses — wire the list / editor to the confirm dialog with
// local state only (no store, no api).
// ---------------------------------------------------------------------------

function UsersListHarness({ users = USERS }: { users?: AdminUser[] }) {
    const [target, setTarget] = React.useState<AdminUser | null>(null);
    return (
        <AdminShell>
            <UsersListSurface users={users} onRequestDelete={setTarget} />
            <DeleteConfirmDialog
                open={target !== null}
                user={target}
                onOpenChange={open => !open && setTarget(null)}
                onConfirm={() => setTarget(null)}
            />
        </AdminShell>
    );
}

function UserEditorHarness({ user = USERS[1], roleError }: { user?: AdminUser; roleError?: string }) {
    const [target, setTarget] = React.useState<AdminUser | null>(null);
    return (
        <AdminShell>
            <UserEditorSurface user={user} roleError={roleError} onRequestDelete={setTarget} />
            <DeleteConfirmDialog
                open={target !== null}
                user={target}
                onOpenChange={open => !open && setTarget(null)}
                onConfirm={() => setTarget(null)}
            />
        </AdminShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin User Management',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Users table — the default list: on-theme sortable table with search and
 * pagination. Sort by first/last name, email or role; each non-self row exposes
 * a delete action behind a dropdown, set apart from any primary and opening a
 * confirm dialog.
 */
export const UsersTable: Story = {
    name: 'Users Table — Default',
    render: () => <UsersListHarness />,
};

/**
 * Empty — the list renders but no users match the current search. The table
 * keeps its structure and shows a single quiet empty message (no dead end).
 */
export const UsersTableEmpty: Story = {
    name: 'Users Table — Empty',
    render: () => <UsersListHarness users={[]} />,
};

/**
 * Loading — the list is fetching. A centered spinner sits inside a white panel
 * within the shell while the table resolves (mirrors the source loading state).
 */
export const UsersTableLoading: Story = {
    name: 'Users Table — Loading',
    render: () => (
        <AdminShell>
            <div className='flex min-h-[60vh] w-full items-center justify-center rounded-[1.75rem] border border-border/60 bg-card shadow-sm'>
                <Spinner size='lg' />
            </div>
        </AdminShell>
    ),
};

/**
 * Error — the list failed to load. A single on-theme error state explains what
 * happened and what to do next.
 */
export const UsersTableError: Story = {
    name: 'Users Table — Error',
    render: () => (
        <AdminShell>
            <div className='flex min-h-[60vh] w-full items-center justify-center rounded-[1.75rem] border border-border/60 bg-card px-6 shadow-sm'>
                <ErrorState
                    title='Failed to load users'
                    description='Something went wrong. Please try again in a moment.'
                    iconSize='sm'
                />
            </div>
        </AdminShell>
    ),
};

/**
 * User editor — the single-column edit form: labels above fields, account facts
 * as quiet rows, role as a Segmented Choice pill control (active = solid black
 * fill). Save is the single BLACK structural primary; Delete user is destructive
 * and set apart.
 */
export const UserEditor: Story = {
    name: 'User Editor — Form',
    render: () => <UserEditorHarness />,
};

/**
 * User editor (validation) — the role control shows an inline error; the form
 * surfaces what to fix without leaving the single-column layout.
 */
export const UserEditorError: Story = {
    name: 'User Editor — Validation Error',
    render: () => <UserEditorHarness roleError='Select a role for this member.' />,
};

/**
 * Delete confirm — the explicit confirmation dialog for a destructive delete.
 * Cancel (idle) and Delete (destructive) are the only footer actions; the
 * destructive action is never adjacent to a primary.
 */
export const DeleteConfirm: Story = {
    name: 'Delete Confirm — Dialog',
    render: () => {
        function DeleteConfirmHarness() {
            const [open, setOpen] = React.useState(true);
            return (
                <AdminShell>
                    <UsersListSurface onRequestDelete={() => setOpen(true)} />
                    <DeleteConfirmDialog
                        open={open}
                        user={USERS[1]}
                        onOpenChange={setOpen}
                        onConfirm={() => setOpen(false)}
                    />
                </AdminShell>
            );
        }
        return <DeleteConfirmHarness />;
    },
};
