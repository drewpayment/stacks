# Stacks =€

A modern full-stack development platform for building robust web applications.

## Features (

- =à SvelteKit for frontend and backend
- = Authentication with Lucia
- =Ê Database with Drizzle ORM
- <¨ UI components with TailwindCSS and Shadcn
- =Á File storage with Supabase
- =È Analytics with PostHog

## Prerequisites =Ë

- Node.js 18+ or Bun 1.0+
- Docker (optional, for local database)

## Installation =»

```bash
# Clone the repository
git clone https://github.com/yourusername/stacks.git
cd stacks

# Install dependencies
npm install
# or with Bun
bun install
```

## Configuration ™

1. Copy example environment variables
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration

## Development ='

Start the development server:

```bash
npm run dev
# or with Bun
bun run dev
```

Your app will be running at [http://localhost:5173](http://localhost:5173)

## Database Setup =Ã

### Option 1: Docker (recommended)

```bash
# Start PostgreSQL
docker-compose -f docker/postgres.yml up -d

# Run migrations
npm run db:migrate
```

### Option 2: Use your own database

Update the `DATABASE_URL` in your `.env` file to point to your database.

## Testing >ê

```bash
# Run unit tests
npm run test

# Run E2E tests with Playwright
npm run test:e2e
```

## Building for Production <×

```bash
npm run build
```

## Deployment =¢

The project is compatible with Vercel, Netlify, and other SvelteKit-compatible hosting platforms.

```bash
# Deploy to Vercel
vercel
```

## Documentation =Ú

Additional documentation can be found in the `docs/` directory.

## License =Ä

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing >

Contributions are welcome! Please feel free to submit a Pull Request.