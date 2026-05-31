import { X } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/utils';

interface BannerProps {
    variant: 'success' | 'error' | 'info';
    icon?: React.ReactNode;
    message: React.ReactNode;
    action?: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

const variantStyles: Record<BannerProps['variant'], string> = {
    success: 'border-success/30 bg-success/10 text-success',
    error: 'border-destructive/30 bg-destructive/10 text-destructive',
    info: 'border-primary/30 bg-primary/10 text-primary',
};

function Banner({ variant, icon, message, action, onClose, className }: BannerProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-xl border px-5 py-4 text-sm font-medium',
                variantStyles[variant],
                className
            )}
        >
            {icon && <span className='shrink-0'>{icon}</span>}
            <div className='min-w-0 flex-1'>{message}</div>
            {action && <span className='shrink-0'>{action}</span>}
            {onClose && (
                <button
                    type='button'
                    onClick={onClose}
                    className='ml-auto shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current'
                    aria-label='Dismiss'
                >
                    <X className='h-4 w-4' />
                </button>
            )}
        </div>
    );
}

export default memo(Banner);
