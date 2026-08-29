# Database Configuration (Phase J)

This document explains the production data and CMS foundation for Sunward Travel using PostgreSQL and Prisma.

## Content Source Switching (Adapter)

The site uses a repository abstraction (`lib/content/repository.ts`) to safely serve content either from the static fallback files or the live database.

- **Development/Fallback**: Omit `CONTENT_SOURCE` or set it to `static` in `.env`. This requires no database connection.
- **Live Database**: Set `CONTENT_SOURCE=database` in `.env`.

---

## DEVELOPMENT PREPARATION

If you are developing locally with a fresh PostgreSQL instance, you can use the prototyping commands:

1. Configure `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sunward_dev"
   ```
2. Apply the schema directly (destructive if data exists):
   ```bash
   npx prisma db push
   ```
3. Generate the Prisma client:
   ```bash
   npm run db:generate
   ```
4. Seed the database with the certified local static content:
   ```bash
   npm run db:seed
   ```

---

## PRODUCTION ACTIVATION

**DO NOT USE `db push` in production.** Production requires a controlled migration history.

1. **Provision PostgreSQL**: Ensure your production PostgreSQL database is running.
2. **Configure Environment**: Set `DATABASE_URL` (and `DIRECT_URL` if using connection pooling like Supabase/Neon) in the production environment variables.
3. **Run Prisma Migration Deployment**: Apply the version-controlled migration files safely.
   ```bash
   npx prisma migrate deploy
   ```
4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
5. **Run Seed**: Import the locked static content.
   ```bash
   npm run db:seed
   ```
6. **Run Parity Validation**: Ensure the seeded data matches expectations.
7. **Verify Production Routes**: Check that no 404s occurred on public URLs.
8. **Switch Adapter**: Set `CONTENT_SOURCE=database` to direct live traffic to the database.
9. **Smoke-test**: Verify the site operates normally.
10. **Roll back (if necessary)**: Revert to `CONTENT_SOURCE=static`. No code rollback is needed.
