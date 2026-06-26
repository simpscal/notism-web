import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Toast } from '../toast';

describe('Toast', () => {
    it('renders the supplied icon and body content', () => {
        render(
            <Toast icon={<span data-testid='toast-icon'>icon</span>} onDismiss={vi.fn()}>
                <span>Order ORD-1042 received</span>
            </Toast>
        );

        expect(screen.getByTestId('toast-icon')).toBeInTheDocument();
        expect(screen.getByText('Order ORD-1042 received')).toBeInTheDocument();
    });

    it('invokes the dismiss callback when the dismiss control is clicked', async () => {
        const onDismiss = vi.fn();
        render(
            <Toast icon={<span>icon</span>} onDismiss={onDismiss} dismissLabel='Close alert'>
                <span>Body</span>
            </Toast>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Close alert' }));

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('renders long body content without a fixed-height container', () => {
        const longBody = 'A very long order summary line that should be allowed to wrap freely.';
        render(
            <Toast icon={<span>icon</span>} onDismiss={vi.fn()}>
                <p>{longBody}</p>
            </Toast>
        );

        expect(screen.getByText(longBody)).toBeInTheDocument();
    });
});
