import { AlertCircle } from 'lucide-react';
import { type ReactNode, memo } from 'react';

import { cn } from '@/app/utils/index';

interface ErrorStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    iconSize?: 'sm' | 'md';
    className?: string;
}

const defaultIconMd = <AlertCircle className='h-16 w-16 text-destructive' />;
const defaultIconSm = <AlertCircle className='h-12 w-12 text-destructive' />;

function ErrorState({ title, description, icon, action, iconSize = 'md', className }: ErrorStateProps) {
    const defaultIcon = iconSize === 'sm' ? defaultIconSm : defaultIconMd;
    const iconContainerClass =
        iconSize === 'sm' ? 'mb-4 rounded-full bg-destructive/10 p-4' : 'mb-6 rounded-full bg-destructive/10 p-6';
    const titleClass =
        iconSize === 'sm' ? 'mb-2 text-2xl font-semibold text-foreground' : 'mb-4 text-4xl font-black text-foreground';
    const contentPadding = iconSize === 'sm' ? 'py-12' : 'py-20';

    return (
        <div className={cn('flex flex-col items-center justify-center text-center', contentPadding, className)}>
            <div className={iconContainerClass}>{icon ?? defaultIcon}</div>
            <h1 className={titleClass}>{title}</h1>
            {description ? (
                <p
                    className={cn(
                        'max-w-md text-lg leading-relaxed text-muted-foreground',
                        iconSize === 'sm' ? 'mb-0' : 'mb-4'
                    )}
                >
                    {description}
                </p>
            ) : null}
            {action ? <div className='mt-4'>{action}</div> : null}
        </div>
    );
}

export default memo(ErrorState);
