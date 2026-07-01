import { setupServer } from 'msw/node';

// Standalone msw/node entrypoint for tests, decoupled from the Storybook/e2e
// handlers in mocks/handlers|data. No default handlers: every test registers
// its own request handlers via server.use(...).
export const server = setupServer();
