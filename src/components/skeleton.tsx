import { cn } from '@/app/utils/tailwind.utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot='skeleton' className={cn('bg-accent animate-shimmer rounded-md', className)} {...props} />;
}

export { Skeleton };
