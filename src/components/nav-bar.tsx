import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/app/utils/tailwind.utils';

type NavBarVariant = 'consumer' | 'admin';

const NavBarContext = React.createContext<{ variant: NavBarVariant }>({ variant: 'consumer' });

// Domain-blind navigation chrome. Three generic slots: a brand/logo slot
// (NavBarBrand), a nav-items region (NavBarNav / NavBarItem), and a trailing
// actions slot (NavBarActions). The `variant` picks the chrome + the active-item
// treatment so the SAME primitive serves a floating consumer top-nav and a
// flatter admin bar. No entity names, labels, or business rules live here.
const navBarVariants = cva('flex items-center gap-3', {
    variants: {
        variant: {
            consumer: 'h-16 rounded-[1.5rem] border border-border bg-card px-3 shadow-sm lg:rounded-full lg:px-4',
            admin: 'h-14 border-b border-border bg-card px-4',
        },
    },
    defaultVariants: {
        variant: 'consumer',
    },
});

function NavBar({
    className,
    variant = 'consumer',
    ...props
}: React.ComponentProps<'header'> & VariantProps<typeof navBarVariants>) {
    return (
        <NavBarContext.Provider value={{ variant: variant ?? 'consumer' }}>
            <header
                data-slot='nav-bar'
                data-variant={variant}
                className={cn(navBarVariants({ variant }), className)}
                {...props}
            />
        </NavBarContext.Provider>
    );
}

function NavBarBrand({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='nav-bar-brand' className={cn('flex shrink-0 items-center gap-2', className)} {...props} />;
}

function NavBarNav({ className, ...props }: React.ComponentProps<'nav'>) {
    return <nav data-slot='nav-bar-nav' className={cn('flex items-center gap-1', className)} {...props} />;
}

// The active item is expressed as a real navigation selection (aria-current),
// never as a Button in a "selected" style. Active treatment is token-driven and
// keyed off the bar variant: consumer promotes the current tab to a white pill
// with the primary accent (the one "you are here" mark); admin uses a routine
// ink fill.
const navBarItemVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                consumer: '',
                admin: '',
            },
            active: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: 'consumer',
                active: false,
                className: 'text-muted-foreground hover:bg-accent hover:text-foreground',
            },
            {
                variant: 'consumer',
                active: true,
                className: 'bg-background text-primary shadow-sm ring-1 ring-black/5',
            },
            {
                variant: 'admin',
                active: false,
                className: 'text-muted-foreground hover:bg-muted hover:text-foreground',
            },
            {
                variant: 'admin',
                active: true,
                className: 'bg-selected text-selected-foreground',
            },
        ],
        defaultVariants: {
            variant: 'consumer',
            active: false,
        },
    }
);

function NavBarItem({
    className,
    active = false,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> & { active?: boolean; asChild?: boolean }) {
    const { variant } = React.useContext(NavBarContext);
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot='nav-bar-item'
            data-active={active}
            aria-current={active ? 'page' : undefined}
            className={cn(navBarItemVariants({ variant, active }), className)}
            {...props}
        />
    );
}

function NavBarActions({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='nav-bar-actions'
            className={cn('ml-auto flex items-center gap-1 lg:gap-2', className)}
            {...props}
        />
    );
}

export { NavBar, NavBarBrand, NavBarNav, NavBarItem, NavBarActions, navBarVariants, navBarItemVariants };
