# Blog Project

Monorepo containing a simple blog application with a Cloud/Edge-enabled backend and a Vite + React frontend.

## Repository layout

- `backend/` - TypeScript backend, Prisma schema and migrations, API routes.
- `common/` - Shared utilities used by frontend/backend.
- `frontend/` - Vite + React (TypeScript) application.

## Prerequisites

- Node.js 18+ (or LTS)
- npm or pnpm

## Backend - Setup & Run

1. Install dependencies:

```bash
cd backend
npm install
```

2. Environment variables: create a `.env` (or set in your environment) with at least:

- `DATABASE_URL` — your Postgres/SQLite connection string

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the backend in development:

```bash
npm run dev
```

Check `backend/package.json` for other scripts.

## Frontend - Setup & Run

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Notes

- Prisma migrations are stored under `backend/prisma/migrations`.
- API routes are under `backend/src/routes`.
- Frontend pages live in `frontend/src/pages`.

## Useful Commands (from repo root)

```bash
# Install all deps (from each package)
cd backend && npm install
cd ../frontend && npm install

# Start backend and frontend (in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev
```

## Contributing

Open an issue or submit a PR. Keep changes small and focused.

## License

Anand Pandey
