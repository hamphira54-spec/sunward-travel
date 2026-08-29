# Sunward Admin Authentication Architecture

## Overview
Phase L1 implements a secure administrative foundation using Supabase Auth for identity and Prisma for authorization. 

## Identity vs Authorization
- **Authentication**: Handled entirely by Supabase Auth (email/password).
- **Authorization**: Handled by the \AdminUser\ table in PostgreSQL. A user must exist in Supabase Auth AND have an \ACTIVE\ \AdminUser\ record to access the admin area.

## Key Components
- \AdminUser\ Prisma Model: Maps Supabase \uthUserId\ to local roles and status.
- \equireAdmin()\ Utility: Server-only function that fetches the session and validates the AdminUser record. Throws a redirect to \/admin/login\ if unauthorized.
- \middleware.ts\: Standard Next.js middleware using \@supabase/ssr\ to refresh session tokens securely.
- Login Page: Located at \/admin/login\, uses Next.js server actions.

## Provisioning the First Admin
There is no public registration. To provision the first administrator, you must use the provisioning script:

\\\ash
# 1. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local
# 2. Run the script
ts-node --project scripts/tsconfig.json -r dotenv/config scripts/provision-admin.ts
\\\

The script will prompt for Email, Password, and Display Name. It uses the Supabase service role to bypass email confirmation and create the user directly, then inserts the \AdminUser\ record.

## Future Phases
- **MFA**: Supabase Auth supports MFA. This can be integrated in later phases via Supabase's Enrollment Flow.
- **RBAC**: The \AdminUser\ table has a \ole\ field initialized to \SUPER_ADMIN\, which can be expanded for Editors/Authors.
- **Audit Logging**: Can be attached to server actions in Phase L2.

