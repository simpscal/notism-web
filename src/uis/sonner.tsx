import { Toaster as Sonner, ToasterProps } from 'sonner';

import { useTheme } from '@/core/contexts';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme();

    return (
        <Sonner
            theme={theme}
            position='bottom-right'
            className='toaster group'
            closeButton
            richColors
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--success-text': 'var(--success)',
                    '--error-text': 'var(--destructive)',
                    '--warning-text': 'var(--warning)',
                    '--info-text': 'var(--info)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
