import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/app/utils/tailwind.utils';

// Domain-blind navigation chrome. Three generic slots: a brand/logo slot
// (NavBarBrand), a nav-items region (NavBarNav / NavBarItem), and a trailing
// actions slot (NavBarActions). One unified bar serves every surface. No entity
// names, labels, or business rules live here.
const navBarVariants = cva(
    'flex h-16 items-center gap-3 rounded-[1.5rem] border border-border bg-card px-3 shadow-sm lg:rounded-full lg:px-4'
);

function NavBar({ className, ...props }: React.ComponentProps<'header'>) {
    return <header data-slot='nav-bar' className={cn(navBarVariants(), className)} {...props} />;
}

function NavBarBrand({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='nav-bar-brand' className={cn('flex shrink-0 items-center gap-2', className)} {...props} />;
}

function NavBarNav({ className, ...props }: React.ComponentProps<'nav'>) {
    return <nav data-slot='nav-bar-nav' className={cn('flex items-center gap-1', className)} {...props} />;
}

// The active item is expressed as a real navigation selection (aria-current),
// never as a Button in a "selected" style. Active promotes the current tab to a
// white pill with the primary accent (the one "you are here" mark).
const navBarItemVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            active: {
                true: 'bg-background text-primary shadow-sm ring-1 ring-black/5',
                false: 'text-muted-foreground hover:bg-accent hover:text-foreground',
            },
        },
        defaultVariants: {
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
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot='nav-bar-item'
            data-active={active}
            aria-current={active ? 'page' : undefined}
            className={cn(navBarItemVariants({ active }), className)}
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
