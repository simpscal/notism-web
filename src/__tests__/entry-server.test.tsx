// @vitest-environment node
//
// Runs without jsdom (no `window`/`document`) to actually exercise the SSR code
// path — this is what `bun run serve:ssr` executes in production.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { render } from '../entry-server';

import { server } from '@/test/server';

describe('entry-server render()', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
    afterAll(() => server.close());

    it('renders the landing page markup for "/"', async () => {
        const result = await render('/', 'https://notism.example.com');

        expect(result.html).toContain('Notism');
        expect(result.html).toContain('Order fresh food in minutes');
        expect(result.html).toContain('Frequently asked questions');
    });

    it('renders a route-specific title', async () => {
        const result = await render('/', 'https://notism.example.com');

        expect(result.title).toBe('Notism — Order fresh food in minutes');
    });

    it('renders description + OG/Twitter meta tags with an absolute canonical URL', async () => {
        const result = await render('/', 'https://notism.example.com');

        expect(result.headExtra).toContain('<meta name="description"');
        expect(result.headExtra).toContain('property="og:title"');
        expect(result.headExtra).toContain('property="og:url" content="https://notism.example.com/"');
        expect(result.headExtra).toContain('name="twitter:card" content="summary_large_image"');
        expect(result.headExtra).toContain('rel="canonical" href="https://notism.example.com/"');
    });

    it('never throws and never emits the client-only auth loading spinner', async () => {
        // Without the SSR guard in `useReloadUser`, `App`'s `isInitialized` gate would
        // stay false forever server-side (its effects never run) and this would render
        // the spinner instead of the landing page.
        const result = await render('/', 'https://notism.example.com');

        expect(result.html).not.toContain('animate-spin');
    });
});
