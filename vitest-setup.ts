import '@testing-library/jest-dom/vitest'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'
import { beforeAll, afterEach, afterAll, } from 'vitest';

const server = setupServer(...handlers);

beforeAll(() => server.listen({
  onUnhandledRequest: 'error',
}));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
