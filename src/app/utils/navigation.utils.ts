import type { NavigateFunction } from 'react-router-dom';

class NavigationUtils {
    private navigateFn!: NavigateFunction;

    initialize(navigate: NavigateFunction) {
        this.navigateFn = navigate;
    }

    navigate(to: string, options?: { replace?: boolean; state?: unknown }) {
        this.navigateFn(to, options);
    }
}

export const navigationUtils = new NavigationUtils();
