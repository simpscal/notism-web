import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/app/utils/tailwind.utils';

interface ToastProps extends Omit<React.ComponentProps<'div'>, 'children'> {
    /** Leading icon slot rendered in the toast's icon column. */
    icon?: React.ReactNode;
    /** Toast body content. Wraps freely; the card has no fixed height. */
    children?: React.ReactNode;
    /** Invoked when the dismiss control is activated. */
    onDismiss: () => void;
    /** Accessible label for the dismiss control. */
    dismissLabel?: string;
}

function Toast({ icon, children, onDismiss, dismissLabel = 'Dismiss', className, ...props }: ToastProps) {
    return (
        <div
            data-slot='toast'
            className={cn(
                'bg-popover text-popover-foreground flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border p-4 shadow-lg',
                className
            )}
            {...props}
        >
            {icon != null && <span className='mt-0.5 flex shrink-0 items-center justify-center'>{icon}</span>}
            <div className='min-w-0 flex-1'>{children}</div>
            <button
                type='button'
                aria-label={dismissLabel}
                onClick={onDismiss}
                className='text-muted-foreground/70 hover:bg-accent hover:text-foreground focus-visible:ring-ring shrink-0 rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none'
            >
                <XIcon className='size-4' aria-hidden />
            </button>
        </div>
    );
}

export { Toast };
export type { ToastProps };
