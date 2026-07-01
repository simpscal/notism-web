import {
    Login,
    RequestResetPassword,
    ResetPassword,
    SettingsAppearance,
    SettingsPayment,
    SettingsProfile,
    Signup,
} from './lazy-pages';
import { PreloadableComponent } from './lazy-with-preload';

import { ROUTES } from '@/app/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPreloadableComponent = PreloadableComponent<any>;

/** `ROUTES` values are stored without a leading slash (except HOME, which is `/`) — this
 *  normalizes an entry to the exact string a `<NavLink to>`/`location.pathname` uses. */
function toPath(route: string): string {
    return route === ROUTES.HOME ? ROUTES.HOME : `/${route}`;
}

/** Maps each route in a true URL-nested route group (`auth/*`, `settings/*` — the only groups
 * with actual nested `<Route>` children in `src/app.routes.tsx`) to its sibling routes in that
 * same group. Consumed by `useIdlePreload` to warm sibling chunks during browser idle time,
 * since a visitor on one nested route is likely to navigate to a sibling next (e.g. settings
 * tabs, auth form switches). Flat top-level routes are not true nested children of one another
 * and get no entry here.
 *
 * `auth/oauth/:provider/callback` is a 5th nested child under `auth`, but its dynamic path
 * segment means it can't be a `location.pathname`-keyed trigger the same way. It's also reached
 * only via redirect from an external OAuth provider, never navigated to directly by the user, so
 * it's excluded as both a key and a preload target here. */
export const ROUTE_PRELOAD_MAP: Record<string, AnyPreloadableComponent[]> = {
    [toPath(ROUTES.AUTH.LOGIN)]: [Signup, RequestResetPassword, ResetPassword],
    [toPath(ROUTES.AUTH.SIGNUP)]: [Login, RequestResetPassword, ResetPassword],
    [toPath(ROUTES.AUTH.REQUEST_RESET_PASSWORD)]: [Login, Signup, ResetPassword],
    [toPath(ROUTES.AUTH.RESET_PASSWORD)]: [Login, Signup, RequestResetPassword],

    [toPath(ROUTES.SETTINGS.PROFILE)]: [SettingsAppearance, SettingsPayment],
    [toPath(ROUTES.SETTINGS.APPEARANCE)]: [SettingsProfile, SettingsPayment],
    [toPath(ROUTES.SETTINGS.PAYMENT)]: [SettingsProfile, SettingsAppearance],
};
