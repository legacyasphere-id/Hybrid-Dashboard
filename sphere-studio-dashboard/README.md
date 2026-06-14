# Sphere Studio Dashboard

Studio Management SaaS for solo freelancers and small creative studios.

Manage clients, projects, and tasks in one place — built for designers and web developers running 4–12 active clients.

---

## Current Status

| Area | Status |
|------|--------|
| Auth (email/password + Google OAuth) | ✅ Working |
| Workspace creation + RBAC | ✅ Working |
| App shell (sidebar, topbar, nav) | ✅ Design tokens applied |
| Clients CRUD | 🔲 In progress |
| Projects CRUD | 🔲 In progress |
| Tasks CRUD | 🔲 In progress |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Client State | Zustand |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL + RLS) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (staging + production)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/legacyasphere-id/Hybrid-Dashboard.git
cd Hybrid-Dashboard/sphere-studio-dashboard

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
sphere-studio-dashboard/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # AppShell, Sidebar, PageHeader
│   └── domain/             # Feature components (ProjectCard, TaskRow, etc.)
├── lib/
│   ├── supabase/           # Supabase client (browser + server)
│   ├── auth/               # Auth helpers and session utilities
│   └── validators/         # Zod schemas
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript interfaces
├── stores/                 # Zustand stores
├── services/               # API call functions
└── public/                 # Static assets
```

---

## Development Workflow

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
```

**Branch strategy:**
- `main` → production (Vercel)
- `develop` → staging (Vercel preview)
- `feature/*` → feature branches, PR into `develop`

---

## Design System

**Dark sidebar (`#111111`, 240px) + white topbar** — original Hybrid Dashboard tokens:

```css
--hs-accent: ...          /* brand accent */
--hs-sidebar-bg: #111111  /* dark sidebar */
--hs-neutral-*: ...       /* neutral scale */
--hs-radius-*: ...        /* border radius scale */
--hs-shadow-*: ...        /* shadow scale */
```

shadcn HSL tokens are remapped to the above so all shadcn components still render correctly.

Sidebar features: dark nav items with hover states, Settings link, AI assistant card, gradient workspace switcher, dark user menu with avatar initials.

---

## MVP Features

- **Auth** — Email/password + Google OAuth, workspace-scoped sessions
- **Workspaces** — Multi-workspace support with RBAC (owner / admin / member), `create_workspace_for_user` SECURITY DEFINER RPC
- **Clients** — CRUD client management
- **Projects** — CRUD with status machine (planning → complete)
- **Tasks** — CRUD with assignment and cross-project view

---

## Changelog

| Date | What changed |
|------|--------------|
| Jun 11, 2026 | **Design tokens applied**: dark `#111111` sidebar, white topbar, breadcrumb, search kbd trigger, bell+dot, avatar initials, workspace switcher, user menu |
| Jun 11, 2026 | **Auth fix**: moved login/signup to browser Supabase client — Server Actions weren't reliably flushing cookies before redirect, causing `auth.uid() = NULL` on API calls |
| Jun 11, 2026 | **Workspace creation fix**: switched to `create_workspace_for_user` RPC (SECURITY DEFINER) — server-side RLS was rejecting the `workspaces` INSERT due to missing session JWT |
| Jun 10, 2026 | **Redirect loop fix**: moved `workspace/new` outside `(app)` route group; added `force-dynamic` to app layout |

---

## Environment Variables

See `.env.example` for all required variables.

Never commit `.env.local` — it is gitignored.
