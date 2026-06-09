# Sphere Studio Dashboard — Claude Code Guide

## Project Overview

Studio Management SaaS for solo freelancers and small creative studios.
Built following the Sphere Method (Phase 0–7 SDLC).

**ICP (locked):** Solo freelancer — brand/web/UX designer or web developer · 1–3 people · 4–12 clients.

---

## Stack (locked — do not change without explicit approval)

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict + noUncheckedIndexedAccess) |
| Styling | Tailwind CSS (CLI build) |
| UI components | shadcn/ui |
| Icons | Lucide React |
| Font | Inter via next/font |
| Client state | Zustand |
| Server state / cache | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth (email+pass + Google OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Key Conventions

### File structure
```
app/              # Next.js App Router pages and layouts
components/ui/    # shadcn/ui primitives (never edit generated files directly)
components/layout/ # AppShell, Sidebar, PageHeader
components/domain/ # Feature-specific components (ProjectCard, TaskRow, etc.)
lib/supabase/     # Supabase client (browser + server)
lib/auth/         # Auth helpers and session utilities
lib/validators/   # Zod schemas (shared between forms and API)
hooks/            # Custom React hooks
types/            # TypeScript interfaces and type exports
stores/           # Zustand stores
services/         # API call functions (used by TanStack Query)
```

### Path aliases
All imports use `@/` — never use relative paths that go up more than one level.

### Multi-tenancy rules
- `workspace_id` is **always** resolved server-side from the authenticated session
- **Never** read `workspace_id` from URL params or request body
- Every tenant table has Row Level Security (RLS) enabled
- Use `workspace_id` from the server-side session in all DB queries

### RBAC
Roles per workspace: `owner` > `admin` > `member`
- `owner`: billing, delete workspace
- `admin`: invite/remove members, workspace settings
- `member`: CRUD on clients, projects, tasks within workspace

### Auth flow
- Sessions stored in httpOnly cookie (Supabase SSR client)
- Middleware at `middleware.ts` protects all routes under `/dashboard`, `/clients`, `/projects`, `/tasks`, `/settings`, `/workspaces`
- Public routes: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`

### API conventions
- All API routes: `app/api/v1/[resource]/route.ts`
- Response envelope: `{ data, error, meta }`
- Pagination: cursor-based (`cursor`, `limit` params)
- Errors: `{ error: { code, message, details } }`

### TypeScript
- `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`
- No `any` — use `unknown` and narrow explicitly
- Zod schemas are the source of truth for runtime validation; infer TypeScript types from them

---

## MVP Scope (locked)

Features in scope for v1:
- Authentication (email+password, Google OAuth)
- Workspaces (create, switch, settings)
- Clients (CRUD)
- Projects (CRUD + status machine)
- Tasks (CRUD + assignment)

Out of scope for v1: Time tracking, invoicing, Stripe billing, public client portal.

---

## Project Status Machine

```
planning → in_progress → in_review → in_revision → awaiting_feedback → complete → archived
```

---

## Development Workflow

1. Branch from `develop` for each feature: `feature/[feature-name]`
2. Open PR to `develop` — CI runs type-check + lint + tests
3. `develop` auto-deploys to staging (Vercel preview)
4. `main` is production — merge from `develop` after staging sign-off

---

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```
