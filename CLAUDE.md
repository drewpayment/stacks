# Stacks Development Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Type check the codebase
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm test` - Run Playwright E2E tests
- `npm run vi:test` - Run Vitest unit tests
- `npm run vi:test -- -t "test name"` - Run specific Vitest test

## Database Commands
- `npm run generate-migrations:postgres` - Generate Drizzle migrations
- `npm run migrate:postgres` - Run Drizzle migrations

## Code Style
- **Formatting**: Use tabs, single quotes, 100 chars max line length
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Types**: Always use strong TypeScript typing, avoid `any`
- **Components**: Svelte 5 with runes, well-documented props
- **Error handling**: Use try/catch with meaningful error messages
- **Imports**: Group by external, internal, types; sort alphabetically
- **Tests**: Unit tests for utils, E2E tests for flows