# Database Configuration (Phase J)

This document explains the production data and CMS foundation for Sunward Travel using Prisma.

## Setup

1. Copy `.env.example` to `.env` and set the `DATABASE_URL` for your PostgreSQL instance:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sunward"
   ```

2. Generate the Prisma client:
   ```bash
   npm run db:generate
   ```

3. Push the schema to the database:
   ```bash
   npm run db:push
   ```

4. Seed the database with the initial static content:
   ```bash
   npm run db:seed
   ```

## Content Source Switching

The site uses a repository abstraction (`lib/content/repository.ts`) to serve content either from the static files or the database.

- To use **static data**, either do not set `CONTENT_SOURCE` or set it to `static` in `.env`.
- To use the **database**, set `CONTENT_SOURCE=database` in `.env`.
