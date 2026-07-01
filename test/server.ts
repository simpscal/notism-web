import { setupServer } from 'msw/node';

import { handlers } from '@/mocks/handlers';

// Single composed entrypoint for msw/node request mocking in tests. Reuses the
// same handlers Storybook consumes via mocks/browser.ts, instead of every test
// file hand-rolling its own setupServer(...) instance. Tests layer per-case
// fixtures/error responses on top via server.use(...); the shared handlers are
// a baseline, not a replacement for per-test flexibility.
export const server = setupServer(...handlers);
