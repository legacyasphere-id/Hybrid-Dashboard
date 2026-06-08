# Studio Dashboard — Complete SDLC Audit
## LegacyaSphere Studio Management SaaS

**Prepared by:** Senior Product Architect + Staff Software Engineer (AI Pair)
**Date:** 2026-06-08
**Repository:** legacyasphere-id/Hybrid-Dashboard
**Subject:** Reverse-engineering a high-fidelity prototype into a production-ready SaaS blueprint

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current SDLC Phase Assessment](#2-current-sdlc-phase-assessment)
3. [SDLC Gap Analysis](#3-sdlc-gap-analysis)
4. [Product Vision & Scope](#4-product-vision--scope)
5. [User Personas](#5-user-personas)
6. [User Stories](#6-user-stories)
7. [Functional Requirements — Per Dashboard Section](#7-functional-requirements--per-dashboard-section)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Database Schema Design](#9-database-schema-design)
10. [API Specification](#10-api-specification)
11. [Authentication & Authorization Model](#11-authentication--authorization-model)
12. [Role & Permission Matrix](#12-role--permission-matrix)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Monitoring Strategy](#15-monitoring-strategy)
16. [Production Readiness Checklist](#16-production-readiness-checklist)
17. [SDLC Roadmap](#17-sdlc-roadmap)

---

## 1. Executive Summary

The Hybrid-Dashboard is a **polished, single-file HTML/CSS/JS prototype** for LegacyaSphere — a studio operations platform targeting design agencies, creative studios, freelancers, and small teams.

### What Exists Today

| Artifact | Status |
|---|---|
| High-fidelity UI prototype | ✅ Complete |
| Design token system | ✅ Complete |
| Responsive layout | ✅ Complete |
| Mock data for all widgets | ✅ Complete |
| Interactive modals (Search, New Project, AI) | ✅ Partial (stub logic) |
| localStorage task persistence | ✅ Minimal |
| Backend / API | ❌ None |
| Database | ❌ None |
| Authentication | ❌ None |
| Real business logic | ❌ None |
| Tests | ❌ None |
| CI/CD pipeline | ❌ None |
| Environment configuration | ❌ None |
| Error handling | ❌ None |
| Security controls | ❌ None |

### Gap in One Sentence

> This project has **finished the design phase** and is at the **very start of the engineering phase** — approximately 5% of total production readiness.

---

## 2. Current SDLC Phase Assessment

### SDLC Phase Map

```
Discovery → Requirements → Design → Development → Testing → Deployment → Monitoring
   ✅           ⚠️ Partial    ✅        🔴 Start        ❌          ❌           ❌
```

### Phase-by-Phase Breakdown

#### Phase 1 — Discovery ✅ DONE
You have validated a real problem space (studio management for creative agencies). The dashboard UI confirms stakeholder alignment on the product direction.

#### Phase 2 — Requirements ⚠️ PARTIAL
- **Exists:** Implicit requirements visible in the UI (metrics, projects, tasks)
- **Missing:** Formal PRD, written user stories, acceptance criteria, non-functional requirements, business rules documentation

#### Phase 3 — Design ✅ DONE
- UI/UX design is complete and implemented as a working prototype
- Design tokens are defined and applied consistently
- Responsive behavior is implemented
- **Missing:** Information architecture document, data flow diagrams, system architecture diagram, database ER diagram, API contract

#### Phase 4 — Development 🔴 NOT STARTED
- No backend exists
- No database exists
- No authentication exists
- No real data pipeline exists
- The frontend is a monolith HTML file — needs to be componentized

#### Phase 5 — Testing ❌ NOT STARTED
- No unit tests
- No integration tests
- No E2E tests
- No test plan

#### Phase 6 — Deployment ❌ NOT STARTED
- No CI/CD pipeline
- No environment config (dev/staging/prod)
- Tailwind uses CDN (explicitly not production-ready — noted in the code itself)
- No domain, no hosting, no SSL

#### Phase 7 — Monitoring ❌ NOT STARTED
- No error tracking
- No performance monitoring
- No uptime monitoring
- No analytics

### Verdict

**Current Phase: Late Design / Pre-Development**

You need to complete Requirements documentation, then enter Development with a proper architecture plan. This audit provides the bridge.

---

## 3. SDLC Gap Analysis

### Artifacts Inventory

| SDLC Artifact | Exists | Quality | Priority to Create |
|---|---|---|---|
| Product Vision Statement | ❌ | — | P0 |
| Product Requirements Document (PRD) | ❌ | — | P0 |
| User Personas | ❌ | — | P0 |
| User Stories | ❌ | — | P0 |
| Acceptance Criteria | ❌ | — | P0 |
| Functional Requirements | ❌ | — | P0 |
| Non-Functional Requirements | ❌ | — | P0 |
| UI Wireframes / Prototype | ✅ | High | Done |
| Design System / Tokens | ✅ | High | Done |
| System Architecture Diagram | ❌ | — | P0 |
| Database Schema | ❌ | — | P0 |
| Entity Relationship Diagram (ERD) | ❌ | — | P0 |
| API Specification (OpenAPI) | ❌ | — | P0 |
| Authentication Model | ❌ | — | P0 |
| Role & Permission Matrix | ❌ | — | P0 |
| Data Flow Diagrams | ❌ | — | P1 |
| Technical Stack Decision | ❌ | — | P0 |
| Development Environment Setup | ❌ | — | P0 |
| Code Style Guide / Linting | ❌ | — | P1 |
| Git Branching Strategy | ⚠️ | Minimal | P1 |
| Unit Tests | ❌ | — | P1 |
| Integration Tests | ❌ | — | P1 |
| E2E Tests | ❌ | — | P1 |
| Test Plan | ❌ | — | P1 |
| CI/CD Pipeline | ❌ | — | P1 |
| Environment Config (dev/stage/prod) | ❌ | — | P0 |
| Security Review | ❌ | — | P0 |
| Deployment Runbook | ❌ | — | P2 |
| Monitoring & Alerting Setup | ❌ | — | P2 |
| Error Tracking | ❌ | — | P1 |
| Analytics Plan | ❌ | — | P2 |
| SLA Definition | ❌ | — | P2 |
| Disaster Recovery Plan | ❌ | — | P3 |
| Documentation (User-facing) | ❌ | — | P3 |
| Changelog / Release Notes Process | ❌ | — | P3 |

**P0** = Blocks engineering from starting  
**P1** = Required before first production release  
**P2** = Required within first month post-launch  
**P3** = Required within first quarter post-launch

---

## 4. Product Vision & Scope

### 4.1 Product Vision Statement

> **LegacyaSphere** is the operating system for creative studios — giving agencies, freelancers, and small design teams a single workspace to track projects, clients, revenue, and time, replacing fragmented spreadsheets, Notion docs, and email threads with one intelligent, real-time dashboard.

### 4.2 Mission

Enable creative professionals to spend less time managing operations and more time doing creative work.

### 4.3 Target Market

| Segment | Description | Size Estimate |
|---|---|---|
| Freelance designers | Solo creative workers managing 3–15 clients | Large |
| Small design agencies | 2–15 person studios | Medium |
| Creative studios | Photography, video, branding agencies | Medium |
| Boutique dev studios | Small software product studios | Medium |

### 4.4 Value Proposition

| Problem | LegacyaSphere Solution |
|---|---|
| Revenue tracking scattered across invoicing tools | Live revenue MTD dashboard with historical trends |
| Project status managed in Notion/spreadsheets | Real-time project status with client attribution |
| No visibility into team capacity | Hours logged per project with burndown tracking |
| Client communications in email threads | Centralized client activity feed |
| New project onboarding is ad-hoc | Structured new project flow with templates |

### 4.5 Product Scope — MVP vs. Future

#### MVP Scope (v1.0)

- Multi-user authentication (single workspace per subscription)
- Dashboard overview (all current widgets with real data)
- Project management (CRUD, status, client assignment, due dates)
- Client management (CRUD, contact info, project history)
- Task management (daily tasks with priority, due time)
- Revenue tracking (manual invoice entry, MTD calculation)
- Time logging (manual time entries against projects)
- Activity feed (auto-generated from system events)
- Basic search (projects, clients, tasks)
- Notifications (in-app, real-time for key events)

#### Post-MVP Scope (v1.x — v2.0)

- Invoice generation and PDF export
- Team member management and permissions
- File attachments per project
- Client portal (read-only view for clients)
- Integrations (Stripe for payments, Toggl for time, Slack for notifications)
- AI assistant (project summaries, revenue forecasting)
- Pipeline / kanban view
- Recurring project templates
- Multi-workspace / agency-level accounts

#### Out of Scope (Never / Third-party)

- Built-in video conferencing
- Email client
- Accounting / bookkeeping (defer to QuickBooks integration)
- Contract e-signing (defer to DocuSign integration)

---

## 5. User Personas

### Persona 1 — Alex, The Freelance Designer

| Field | Value |
|---|---|
| Role | Freelance Brand Designer |
| Age | 28 |
| Team size | Solo |
| Clients | 5–12 active |
| Pain points | Losing track of which project is overdue, forgetting to invoice, no revenue visibility |
| Goal | Run their freelance business like a professional studio |
| Tech comfort | High — uses Figma, Notion, Linear |
| Subscription tier | Individual ($29/mo) |

**Primary Jobs-to-be-Done:**
- Know instantly how much revenue I've earned this month
- See which client projects are due this week
- Log today's tasks and check them off
- Quickly create a new project when I sign a new client

---

### Persona 2 — Maya, The Studio Owner

| Field | Value |
|---|---|
| Role | Creative Director / Studio Owner |
| Age | 36 |
| Team size | 4–8 people |
| Clients | 15–30 active |
| Pain points | No visibility into what the team is working on, client billing is chaotic, revenue unpredictability |
| Goal | Real-time operational visibility across the whole studio |
| Tech comfort | Medium-high |
| Subscription tier | Team ($79/mo, up to 10 seats) |

**Primary Jobs-to-be-Done:**
- See all active projects and their status in one place
- Know which clients owe money
- Track team hours by project
- Get alerted when a project is at risk (overdue, needs revision)

---

### Persona 3 — Jordan, The Project Manager

| Field | Value |
|---|---|
| Role | PM / Account Manager at a design agency |
| Age | 31 |
| Team size | Works within a 10–20 person agency |
| Clients | Manages 8–20 accounts |
| Pain points | Client communication gaps, status updates stuck in email, can't track revision cycles |
| Goal | Proactively manage client relationships before things go wrong |
| Tech comfort | High |
| Subscription tier | Works within a Team account |

**Primary Jobs-to-be-Done:**
- Update project statuses quickly
- See notifications about client approvals and revision requests
- Prepare status updates for the weekly client call

---

## 6. User Stories

### Epic 1 — Authentication & Onboarding

```
US-001  As a new user, I want to sign up with email + password so I can create my workspace.
US-002  As a returning user, I want to log in and be taken directly to my dashboard.
US-003  As a user, I want to reset my password via email if I forget it.
US-004  As a workspace owner, I want to invite team members by email.
US-005  As an invited team member, I want to accept an invitation and set up my account.
US-006  As a user, I want to configure my workspace name and branding.
```

### Epic 2 — Dashboard Overview

```
US-010  As a user, I want to see Revenue MTD so I know how much I've earned this month.
US-011  As a user, I want to see a trend vs last month on Revenue MTD.
US-012  As a user, I want to see Active Projects count so I know my current workload.
US-013  As a user, I want to see Active Clients count.
US-014  As a user, I want to see Hours Logged this week.
US-015  As a user, I want to see a sparkline trend on each KPI card.
US-016  As a user, I want to see the Revenue Chart over 7D / 30D / 90D periods.
US-017  As a user, I want to see a projected revenue figure on the chart.
US-018  As a user, I want to hover over the revenue chart to see exact values per day.
```

### Epic 3 — Project Management

```
US-020  As a user, I want to create a new project with a name, client, and due date.
US-021  As a user, I want to see all active projects in a table sorted by due date.
US-022  As a user, I want to update a project's status (Planning, In Progress, In Review, etc.).
US-023  As a user, I want to see a visual warning when a project is due within 3 days.
US-024  As a user, I want to archive a completed project.
US-025  As a user, I want to filter projects by status.
US-026  As a user, I want to click a project to see its full detail page.
US-027  As a user, I want to assign team members to a project.
```

### Epic 4 — Client Management

```
US-030  As a user, I want to add a new client with contact information.
US-031  As a user, I want to see a list of all active clients.
US-032  As a user, I want to see all projects associated with a client.
US-033  As a user, I want to see total billed and paid amounts per client.
US-034  As a user, I want to mark a client as inactive.
```

### Epic 5 — Task Management

```
US-040  As a user, I want to see my tasks for today on the dashboard.
US-041  As a user, I want to add a new task with a description and priority.
US-042  As a user, I want to set a time for a task (e.g., "2:00 PM call").
US-043  As a user, I want to check off a completed task.
US-044  As a user, I want tasks to persist between sessions.
US-045  As a user, I want to delete a task I no longer need.
US-046  As a user, I want to assign a task to a project.
```

### Epic 6 — Revenue & Invoicing

```
US-050  As a user, I want to log a payment received against a project.
US-051  As a user, I want Revenue MTD to update automatically when I log a payment.
US-052  As a user, I want to see a breakdown of revenue by client.
US-053  As a user, I want to see revenue over time in the chart.
US-054  As a user, I want to create an invoice for a project.
US-055  As a user, I want to mark an invoice as paid.
```

### Epic 7 — Time Tracking

```
US-060  As a user, I want to log hours against a specific project.
US-061  As a user, I want Hours Logged on the dashboard to reflect real time entries.
US-062  As a user, I want to see total hours per project.
US-063  As a user, I want to set an estimated hours budget for a project.
US-064  As a user, I want to see a warning when hours logged exceed the budget.
```

### Epic 8 — Notifications & Activity

```
US-070  As a user, I want to see a real-time activity feed of key events.
US-071  As a user, I want to receive in-app notifications for project status changes.
US-072  As a user, I want to receive notifications when a client pays an invoice.
US-073  As a user, I want to mark notifications as read.
US-074  As a user, I want a notification bell badge count showing unread notifications.
```

### Epic 9 — Search

```
US-080  As a user, I want to search across projects, clients, and tasks from anywhere.
US-081  As a user, I want search results to appear instantly as I type.
US-082  As a user, I want to open a search result directly from the results list.
US-083  As a user, I want to use ⌘K keyboard shortcut to open search.
```

---

## 7. Functional Requirements — Per Dashboard Section

This section performs the full reverse-engineering from UI → production reality for every visible dashboard component.

---

### 7.1 Revenue MTD (Metric Card)

#### Current State
Hardcoded value: `$24,580` with `+12.4%` trend badge and a sparkline. All mock data.

#### Real Business Process
Revenue Month-to-Date is calculated by summing all **confirmed payments received** within the current calendar month. The system must:
1. Accept payment entries (manual or via integration)
2. Sum confirmed payments from day 1 of the current month to today
3. Compare to the same period last month to compute the trend percentage
4. Generate sparkline data (daily totals for the last 30 days)

#### Required Database Tables

```sql
payments (
  id, workspace_id, project_id, client_id, invoice_id,
  amount_cents, currency, payment_date, payment_method,
  status (pending|confirmed|refunded), notes,
  created_at, updated_at
)

invoices (
  id, workspace_id, project_id, client_id,
  invoice_number, amount_cents, currency,
  issued_date, due_date, paid_date,
  status (draft|sent|paid|overdue|cancelled),
  created_at, updated_at
)
```

#### Required API Endpoints

```
GET /api/metrics/revenue-mtd
  → Query params: workspace_id, currency
  → Returns: { current_month_total, previous_month_total, trend_percent, sparkline_data[] }

GET /api/metrics/revenue-history
  → Query params: workspace_id, period (7d|30d|90d), currency
  → Returns: { labels[], values[], projected_total }
```

#### Backend Logic
- Aggregate SUM of `payments.amount_cents` WHERE `payment_date >= first day of current month AND status = 'confirmed'`
- Trend: `((current - previous) / previous) * 100`
- Sparkline: Daily SUM for last 30 days
- Currency handling: Store in smallest unit (cents), display formatted

#### Frontend State Requirements
```javascript
{
  revenueMtd: {
    value: number,           // in cents
    currency: 'USD'|'IDR'|...,
    trendPercent: number,
    trendDirection: 'up'|'down'|'flat',
    sparklineData: number[], // 30 points
    isLoading: boolean,
    error: string|null,
    lastFetched: ISO8601
  }
}
```

#### Validation Rules
- Amount must be positive
- Payment date cannot be in the future (unless it's a scheduled payment)
- Currency must match workspace default currency
- One currency per workspace (v1), multi-currency in v2

#### Edge Cases
- No payments this month → show `$0` with `New month!` badge, not `NaN%`
- Previous month had zero revenue → trend should show `First revenue!` instead of `∞%`
- Refunded payments must be subtracted from MTD
- Timezone matters: "current month" is relative to workspace timezone setting
- Payments in multiple currencies (v2 concern)

#### Production Risks
- **P0:** Revenue figures must be accurate — errors destroy user trust and could affect financial decisions
- **P1:** Cache invalidation — MTD must update immediately after a new payment is logged
- **P1:** Timezone bugs — if the server uses UTC and user is in UTC+7, end-of-month calculations will be wrong
- **P2:** No audit trail for payment modifications = compliance risk

---

### 7.2 Active Projects (Metric Card)

#### Current State
Hardcoded: `8` projects, `+2 this week` trend. Mock data.

#### Real Business Process
Count of all projects in the workspace where status is NOT `completed`, `archived`, or `cancelled`. Trend is the delta from 7 days ago.

#### Required Database Tables

```sql
projects (
  id, workspace_id, client_id,
  name, slug, description,
  status (planning|in_progress|in_review|in_revision|awaiting_feedback|completed|archived|cancelled),
  start_date, due_date, completed_date,
  estimated_hours, actual_hours,
  budget_cents, currency,
  project_type (brand|web|app|marketing|other),
  priority (low|medium|high|urgent),
  created_by_user_id,
  created_at, updated_at, archived_at
)
```

#### Required API Endpoints

```
GET /api/metrics/active-projects
  → Returns: { count, trend_delta, trend_direction }

GET /api/projects
  → Query params: workspace_id, status[], page, limit, sort_by, sort_dir
  → Returns: { data: Project[], meta: { total, page, limit } }
```

#### Backend Logic
- Active = status NOT IN ('completed', 'archived', 'cancelled')
- Trend delta = current_active_count - active_count_7_days_ago
- 7 days ago count requires a snapshot or point-in-time query via `updated_at` timestamps

#### Edge Cases
- Project marked archived/completed mid-month — how does it affect historical counts?
- Zero projects → show `0` with `No active projects` subtext, provide CTA to create first project
- Projects created and completed within the same period inflate the trend number

#### Production Risks
- **P1:** Status transitions need atomic updates and an audit log
- **P1:** Soft-delete vs hard-delete policy must be decided before schema creation

---

### 7.3 Active Clients (Metric Card)

#### Current State
Hardcoded: `14` clients, `+1 this month`.

#### Real Business Process
Count of all clients who have at least one active project in the current workspace.

#### Required Database Tables

```sql
clients (
  id, workspace_id,
  name, company_name, email, phone, website,
  billing_address, billing_city, billing_country,
  currency_preference,
  status (active|inactive|prospect|archived),
  notes, tags[],
  created_at, updated_at
)
```

#### Required API Endpoints

```
GET /api/metrics/active-clients
  → Returns: { count, trend_delta, trend_period }

GET /api/clients
  → Query params: workspace_id, status, page, limit, search
  → Returns: { data: Client[], meta }
```

#### Edge Cases
- Client with all projects completed → should they count as "active"? Define business rule: Active Client = client with at least 1 non-archived project, OR a client with any activity in the last 90 days.
- Duplicate client records — email uniqueness constraint per workspace

---

### 7.4 Hours Logged (Metric Card)

#### Current State
Hardcoded: `142h`, `−8h vs. last week`.

#### Real Business Process
Sum of all time entries logged in the current workspace for the current week (Monday–Sunday). Trend is vs. the previous week.

#### Required Database Tables

```sql
time_entries (
  id, workspace_id, project_id, user_id, task_id,
  description, hours_decimal, date,
  billable (boolean), hourly_rate_cents,
  created_at, updated_at
)
```

#### Required API Endpoints

```
GET /api/metrics/hours-logged
  → Query params: workspace_id, user_id (optional, for individual vs team view)
  → Returns: { current_week_hours, previous_week_hours, trend_delta, sparkline_data[] }

POST /api/time-entries
  → Body: { project_id, date, hours, description, billable }
  → Returns: TimeEntry

GET /api/time-entries
  → Query params: workspace_id, project_id, user_id, date_from, date_to, page, limit
```

#### Backend Logic
- "Current week" = ISO week (Monday to Sunday) in workspace timezone
- Team view: sum all users; individual view: filter by `user_id`
- Trend: current_week_total - previous_week_total (can be negative — shown as `−8h`)

#### Validation Rules
- Hours per entry: 0.1 to 24 (max one day)
- Date cannot be more than 1 year in the past
- Date cannot be in the future (unless pre-scheduling)
- Project must be in active status to log hours

#### Edge Cases
- Partially logged week (it's mid-week) — trend comparison unfair; consider "hours per working day" normalization
- Multiple team members logging simultaneously — concurrent write safety
- Hourly rate can change over time — entries should snapshot the rate at logging time

---

### 7.5 Revenue Chart (Interactive SVG Chart)

#### Current State
Interactive SVG chart with hardcoded 7D/30D/90D datasets. Includes hover tooltip, grid lines, Y-axis labels. Fully functional visually, all data is mock.

#### Real Business Process
Time-series chart of confirmed payment amounts. Three views: last 7 days (daily), last 30 days (daily), last 90 days (weekly aggregates). Projected revenue is calculated using a linear regression or simple average.

#### Required API Endpoints

```
GET /api/revenue/chart
  → Query params: workspace_id, period (7d|30d|90d), currency
  → Returns: {
      labels: string[],
      values: number[],
      projected_total: number,
      period_total: number,
      currency: string
    }
```

#### Backend Logic
- 7D: Daily SUM of payments for last 7 calendar days
- 30D: Daily SUM for last 30 days
- 90D: Weekly SUM for last 90 days (13 data points)
- Projection: `(current_mtd / days_elapsed) * days_in_month`
- Cache: Short TTL (5 minutes) since revenue charts aren't real-time

#### Frontend State Requirements
- Chart component should be decoupled from data fetching
- Range selector fires new API call, shows loading skeleton during fetch
- Cached per range key with `lastFetched` timestamp

#### Production Risks
- **P1:** SVG chart must be replaced with a proper charting library (Chart.js, Recharts, or Nivo) for accessibility, tooltips, and responsiveness at scale
- **P0:** Revenue data must be scoped to workspace — leaking another workspace's revenue data is a critical security bug

---

### 7.6 Today's Tasks

#### Current State
Tasks stored in localStorage. Priority dots, checkboxes, time indicators, inline add. Persists within the same browser only.

#### Real Business Process
A personal daily task list for the logged-in user. Tasks can be standalone or linked to a project. Designed for the user's working day — not a full project management tool.

#### Required Database Tables

```sql
tasks (
  id, workspace_id, user_id, project_id (nullable),
  title, description,
  priority (normal|high|urgent),
  due_time (TIME, nullable),
  due_date (DATE),
  status (pending|in_progress|done|cancelled),
  sort_order (integer),
  created_at, updated_at, completed_at
)
```

#### Required API Endpoints

```
GET /api/tasks
  → Query params: workspace_id, user_id, due_date, status
  → Returns: { data: Task[] }

POST /api/tasks
  → Body: { title, priority, due_time, due_date, project_id }
  → Returns: Task

PATCH /api/tasks/:id
  → Body: { status?, priority?, title?, due_time? }
  → Returns: Task

DELETE /api/tasks/:id
  → Returns: 204 No Content

PATCH /api/tasks/reorder
  → Body: { task_ids: string[] } (ordered array)
  → Returns: 200 OK
```

#### Frontend State Requirements
```javascript
{
  tasks: {
    today: Task[],        // filtered by due_date = today
    isLoading: boolean,
    error: string|null,
    optimisticUpdates: Map<id, Task>  // for instant checkbox response
  }
}
```

#### Validation Rules
- Title: 1–255 characters
- Priority: must be one of (normal, high, urgent)
- due_time: valid HH:MM format
- due_date: cannot be more than 2 years in the future

#### Edge Cases
- User checks a task as done → **optimistic update** immediately (don't wait for API response), revert on error
- What happens to unchecked tasks from yesterday? → Auto-roll over to today or require manual action — this must be a defined business rule
- Drag-and-drop reordering needs an atomic sort_order update to avoid race conditions
- Task linked to a project that gets archived → task should still be accessible

#### Production Risks
- **P0:** Tasks currently stored in localStorage — data loss on browser clear, private browsing, or different device
- **P1:** No sync across devices/team members in current implementation

---

### 7.7 Active Projects Table

#### Current State
Hardcoded array of 6 projects with name, client, status badge, due date (with red warning on near-due). No click-through, no filtering, no pagination.

#### Real Business Process
A live, sortable, filterable table of all non-archived projects in the workspace, ordered by proximity to due date. Due date warnings are data-driven (not hardcoded).

#### Required API Endpoints

```
GET /api/projects
  → Query params: workspace_id, status[], sort_by (due_date|created_at|name), sort_dir, page, limit
  → Returns: { data: Project[], meta: { total, page, limit, has_more } }
```

#### Backend Logic
- Default sort: due_date ASC (soonest due first)
- Due date warning logic: server returns `days_until_due` field; frontend applies warning styling when `days_until_due <= 3`
- Pagination: 10 per page on dashboard widget; full list on Projects page

#### Frontend State Requirements
```javascript
{
  projects: {
    active: Project[],
    filters: { status: string[] },
    sort: { field: string, dir: 'asc'|'desc' },
    pagination: { page: number, limit: number, total: number },
    isLoading: boolean,
    error: string|null
  }
}
```

#### Validation Rules (Project Creation)
- Name: 2–100 characters, unique within workspace
- Client: must reference existing client (foreign key)
- Due date: must be in the future at time of creation
- Status: must be one of the defined status values

#### Edge Cases
- More than 10 active projects → pagination or "View all" link to Projects page
- Two projects with identical names for different clients → allowed (unique on name+client combo)
- Project due date in the past → red "overdue" indicator, separate from "due soon"
- Sorting by due date when some projects have no due date → nulls last

#### Production Risks
- **P1:** Table must be virtualized or paginated for workspaces with 50+ projects
- **P0:** Workspace isolation — user must only see projects within their workspace

---

### 7.8 Activity Feed (Notifications)

#### Current State
Hardcoded array of 6 activity items: payment received, approval, status change, revision request, rescheduled event, contract signed. Timeline UI with color dots. No interactivity.

#### Real Business Process
An event log automatically generated by backend actions. Every significant event in the system creates an activity record: invoice paid, project status changed, team member added, client approved deliverable, etc.

#### Required Database Tables

```sql
activity_log (
  id, workspace_id, actor_user_id, target_user_id (nullable),
  entity_type (project|client|invoice|task|payment|user),
  entity_id,
  action (created|updated|status_changed|payment_received|approved|revision_requested|commented|archived),
  metadata (JSONB),   -- e.g., { old_status: 'in_progress', new_status: 'in_review' }
  is_read (boolean),
  created_at
)

notifications (
  id, workspace_id, user_id,
  activity_id (FK to activity_log),
  type (in_app|email|push),
  title, body,
  read_at (nullable),
  created_at
)
```

#### Required API Endpoints

```
GET /api/activity
  → Query params: workspace_id, limit, cursor (for infinite scroll), entity_type
  → Returns: { data: Activity[], next_cursor, has_more }

GET /api/notifications
  → Query params: user_id, unread_only, limit
  → Returns: { data: Notification[], unread_count }

PATCH /api/notifications/:id/read
  → Returns: Notification

PATCH /api/notifications/read-all
  → Returns: { updated_count }
```

#### Backend Logic
- Activity records are created by the backend as side effects of mutations
- Example: When `PATCH /api/projects/:id` changes status → insert into activity_log AND create notifications for all workspace members
- Notification delivery: In-app first; email digest (daily or immediate based on user preference)
- Real-time delivery: Use WebSockets or Server-Sent Events (SSE) to push new activities without polling

#### Frontend State Requirements
```javascript
{
  notifications: {
    items: Notification[],
    unreadCount: number,
    isLoading: boolean,
    hasMore: boolean,
    cursor: string|null
  },
  activityFeed: {
    items: Activity[],
    isLoading: boolean,
    hasMore: boolean,
    cursor: string|null
  }
}
```

#### Production Risks
- **P1:** Activity log can grow very large — needs pagination, indexing on `workspace_id + created_at`, and an archival strategy
- **P1:** Real-time delivery requires WebSocket infrastructure (adds complexity)
- **P0:** Notifications must be scoped to workspace — never leak cross-workspace events
- **P2:** Notification fatigue — too many notifications will cause users to disable them

---

### 7.9 Search

#### Current State
Modal opens on ⌘K or click. Input field present. No actual search logic — the JS shows a `console.log` stub.

#### Real Business Process
Full-text search across the workspace's projects, clients, tasks, and activity. Results must be fast (<200ms) and ranked by relevance and recency.

#### Required Implementation

**Option A (Simple): PostgreSQL Full-Text Search**
- Use `tsvector` columns on projects, clients, tasks
- Combine via `UNION ALL` query with ranking
- Good enough for <10,000 records per workspace

**Option B (Production Scale): Dedicated Search Service**
- Algolia, Typesense, or Meilisearch
- Index records on create/update via background job
- Sub-50ms responses at any scale

**Recommended for MVP:** PostgreSQL FTS (Option A). Migrate to Typesense when needed.

#### Required API Endpoints

```
GET /api/search
  → Query params: workspace_id, q (query string), types[] (project|client|task), limit
  → Returns: {
      results: [
        { type: 'project', id, name, status, client_name, due_date, relevance_score },
        { type: 'client', id, name, company, email, relevance_score },
        { type: 'task', id, title, priority, due_date, project_name, relevance_score }
      ],
      total, query_time_ms
    }
```

#### Frontend State Requirements
```javascript
{
  search: {
    query: string,
    results: SearchResult[],
    isLoading: boolean,
    error: string|null,
    recentSearches: string[]  // localStorage cached
  }
}
```

#### Validation Rules
- Minimum query length: 2 characters before firing API call
- Debounce: 300ms after last keystroke
- Maximum query length: 100 characters

#### Edge Cases
- Empty results → show "No results for X" with suggested actions
- Special characters in search query (e.g., `$`, `%`) → sanitize before SQL
- Search while offline → graceful degradation with cached results
- SQL injection prevention → use parameterized queries, never string interpolation

#### Production Risks
- **P0:** Search must be scoped to workspace — full-text search must never return results from other workspaces
- **P1:** Search performance degrades with table size — plan for indexing from day one

---

### 7.10 New Project Flow (Modal)

#### Current State
Modal with two fields: Project Name and Client Name (text inputs). No validation, no submission logic — inputs collected but not saved anywhere.

#### Real Business Process
Creating a new project requires: selecting/creating a client, naming the project, setting a type, estimated budget, due date, and assigning team members. The system then:
1. Creates the project record
2. Creates a default activity log entry ("Project created")
3. Notifies assigned team members
4. Optionally creates a default set of tasks from a template

#### Required API Endpoints

```
POST /api/projects
  → Body: {
      name, client_id, project_type, description,
      start_date, due_date, budget_cents, currency,
      estimated_hours, assigned_user_ids[]
    }
  → Returns: Project (201)

GET /api/clients/search
  → Query params: workspace_id, q
  → Returns: Client[] (for typeahead in new project modal)
```

#### Validation Rules
- `name`: required, 2–100 chars
- `client_id`: required, must exist in workspace
- `due_date`: optional, but if provided must be >= today
- `budget_cents`: optional, must be positive integer
- `project_type`: must be one of defined enum values
- `assigned_user_ids`: all must be members of the workspace

#### Edge Cases
- Client doesn't exist yet → allow "Create new client" inline within the modal
- User accidentally closes modal → warn if form is dirty
- Duplicate project name for same client → allow (names are not unique across all projects)
- Network error during submission → show error, keep form data, allow retry

#### Production Risks
- **P1:** Modal currently has no CSRF protection
- **P1:** No rate limiting on project creation — potential spam/abuse in multi-tenant SaaS

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|---|---|
| Dashboard initial load | < 2 seconds (LCP) |
| API response time (p50) | < 200ms |
| API response time (p99) | < 1000ms |
| Search response time | < 300ms |
| Chart data fetch | < 500ms |
| Real-time notification delivery | < 2 seconds |
| Time to Interactive (TTI) | < 3 seconds |

### 8.2 Scalability

| Dimension | v1 Target | v2 Target |
|---|---|---|
| Workspaces | 1,000 | 50,000 |
| Users per workspace | 10 | 100 |
| Projects per workspace | 500 | 10,000 |
| Concurrent users | 500 | 10,000 |
| Database rows (payments) | 100,000 | 10,000,000 |

### 8.3 Availability

| Environment | SLA Target |
|---|---|
| Production | 99.9% uptime (8.7 hours downtime/year) |
| Planned maintenance | < 30 min/month during off-peak |

### 8.4 Security

- All API endpoints require authentication (JWT Bearer token)
- All data queries include `workspace_id` scope
- HTTPS only (HSTS enabled)
- Rate limiting: 100 req/min per user, 1000 req/min per workspace
- Input validation and sanitization on all endpoints
- SQL injection prevention via parameterized queries (ORM)
- XSS prevention via Content Security Policy headers
- CSRF protection via SameSite cookies + CSRF tokens
- Secrets management via environment variables (never in code)
- Row-level security (RLS) in PostgreSQL for workspace isolation

### 8.5 Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- ARIA labels on all icon-only buttons
- Color contrast ratio ≥ 4.5:1
- Screen reader compatible
- Focus visible indicators

### 8.6 Browser Support

- Chrome 100+ ✅
- Firefox 100+ ✅
- Safari 15+ ✅
- Edge 100+ ✅
- Mobile Chrome (Android) ✅
- Mobile Safari (iOS 15+) ✅
- Internet Explorer: ❌ Not supported

### 8.7 Data & Privacy

- GDPR compliance (data residency, right to deletion, data export)
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)
- Audit log for all data modifications
- PII isolation per workspace
- Backup: Daily automated backups, 30-day retention
- Point-in-time recovery capability

---

## 9. Database Schema Design

### 9.1 Technology Decision

**Database:** PostgreSQL 15+
**Rationale:** ACID compliance, JSONB for metadata, full-text search, row-level security, excellent hosted options (Supabase, Neon, RDS)

**ORM:** Prisma (TypeScript) or SQLAlchemy (Python)

### 9.2 Complete Schema

```sql
-- ─────────────────────────────────────────────
-- WORKSPACE & USER MANAGEMENT
-- ─────────────────────────────────────────────

CREATE TABLE workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(60) UNIQUE NOT NULL,
  plan          VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free','individual','team','agency')),
  currency      CHAR(3) NOT NULL DEFAULT 'USD',
  timezone      VARCHAR(50) NOT NULL DEFAULT 'UTC',
  logo_url      TEXT,
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(254) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  avatar_url    TEXT,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','manager','member','viewer')),
  invited_by      UUID REFERENCES users(id),
  accepted_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE invitations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         VARCHAR(254) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'member',
  token         VARCHAR(128) UNIQUE NOT NULL,
  invited_by    UUID NOT NULL REFERENCES users(id),
  expires_at    TIMESTAMPTZ NOT NULL,
  accepted_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────────

CREATE TABLE clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  company_name    VARCHAR(150),
  email           VARCHAR(254),
  phone           VARCHAR(30),
  website         TEXT,
  billing_address TEXT,
  billing_city    VARCHAR(100),
  billing_state   VARCHAR(100),
  billing_country CHAR(2),
  billing_zip     VARCHAR(20),
  currency        CHAR(3),
  status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','prospect','archived')),
  tags            TEXT[] NOT NULL DEFAULT '{}',
  notes           TEXT,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_workspace ON clients(workspace_id);
CREATE INDEX idx_clients_status ON clients(workspace_id, status);

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────

CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES clients(id),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(120),
  description     TEXT,
  status          VARCHAR(30) NOT NULL DEFAULT 'planning' CHECK (status IN (
                    'planning','in_progress','in_review','in_revision',
                    'awaiting_feedback','completed','archived','cancelled'
                  )),
  project_type    VARCHAR(30) CHECK (project_type IN ('brand','web','app','marketing','video','photography','other')),
  priority        VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  start_date      DATE,
  due_date        DATE,
  completed_date  DATE,
  estimated_hours DECIMAL(6,1),
  budget_cents    BIGINT,
  currency        CHAR(3),
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at     TIMESTAMPTZ
);

CREATE TABLE project_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  role        VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('lead','contributor','reviewer','observer')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_workspace_status ON projects(workspace_id, status);
CREATE INDEX idx_projects_due_date ON projects(workspace_id, due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_projects_client ON projects(client_id);

-- ─────────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────────

CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  priority    VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal','high','urgent')),
  status      VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done','cancelled')),
  due_date    DATE,
  due_time    TIME,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_project ON tasks(project_id) WHERE project_id IS NOT NULL;

-- ─────────────────────────────────────────────
-- INVOICES & PAYMENTS
-- ─────────────────────────────────────────────

CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id),
  client_id       UUID NOT NULL REFERENCES clients(id),
  invoice_number  VARCHAR(50) NOT NULL,
  amount_cents    BIGINT NOT NULL CHECK (amount_cents > 0),
  tax_cents       BIGINT NOT NULL DEFAULT 0,
  total_cents     BIGINT NOT NULL,
  currency        CHAR(3) NOT NULL,
  status          VARCHAR(15) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  issued_date     DATE,
  due_date        DATE,
  paid_date       DATE,
  notes           TEXT,
  line_items      JSONB NOT NULL DEFAULT '[]',
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, invoice_number)
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  invoice_id      UUID REFERENCES invoices(id),
  project_id      UUID REFERENCES projects(id),
  client_id       UUID NOT NULL REFERENCES clients(id),
  amount_cents    BIGINT NOT NULL CHECK (amount_cents > 0),
  currency        CHAR(3) NOT NULL,
  payment_date    DATE NOT NULL,
  payment_method  VARCHAR(30) CHECK (payment_method IN ('bank_transfer','credit_card','paypal','stripe','cash','other')),
  status          VARCHAR(15) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','refunded','failed')),
  reference       VARCHAR(100),
  notes           TEXT,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_workspace_date ON payments(workspace_id, payment_date);
CREATE INDEX idx_payments_status ON payments(workspace_id, status);
CREATE INDEX idx_invoices_workspace ON invoices(workspace_id);
CREATE INDEX idx_invoices_status ON invoices(workspace_id, status);

-- ─────────────────────────────────────────────
-- TIME TRACKING
-- ─────────────────────────────────────────────

CREATE TABLE time_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  task_id         UUID REFERENCES tasks(id) ON DELETE SET NULL,
  description     TEXT,
  hours           DECIMAL(5,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  date            DATE NOT NULL,
  billable        BOOLEAN NOT NULL DEFAULT TRUE,
  hourly_rate_cents BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_time_entries_workspace_date ON time_entries(workspace_id, date);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_user ON time_entries(user_id, date);

-- ─────────────────────────────────────────────
-- ACTIVITY & NOTIFICATIONS
-- ─────────────────────────────────────────────

CREATE TABLE activity_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_user_id   UUID REFERENCES users(id),
  entity_type     VARCHAR(20) NOT NULL CHECK (entity_type IN ('project','client','invoice','task','payment','user','workspace')),
  entity_id       UUID NOT NULL,
  action          VARCHAR(40) NOT NULL,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_workspace ON activity_log(workspace_id, created_at DESC);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id     UUID REFERENCES activity_log(id),
  type            VARCHAR(20) NOT NULL DEFAULT 'in_app',
  title           VARCHAR(200) NOT NULL,
  body            TEXT,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- ─────────────────────────────────────────────
-- SEARCH OPTIMIZATION
-- ─────────────────────────────────────────────

-- Add tsvector columns for full-text search
ALTER TABLE projects ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))
  ) STORED;

ALTER TABLE clients ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(company_name,'') || ' ' || coalesce(email,''))
  ) STORED;

ALTER TABLE tasks ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
  ) STORED;

CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX idx_clients_search ON clients USING GIN(search_vector);
CREATE INDEX idx_tasks_search ON tasks USING GIN(search_vector);

-- ─────────────────────────────────────────────
-- SESSIONS & AUTH TOKENS
-- ─────────────────────────────────────────────

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  user_agent  TEXT,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_resets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 9.3 ERD Summary (Entity Relationships)

```
workspaces ─┬─< workspace_members >─ users
            │                          │
            ├─< clients                │
            │      │                   │
            ├─< projects >─────────────┤ (project_members)
            │      │                   │
            │      ├─< tasks ──────────┤
            │      ├─< time_entries ───┤
            │      ├─< invoices        │
            │      └─< payments        │
            │                          │
            ├─< activity_log ──────────┤
            └─< notifications ─────────┘
```

---

## 10. API Specification

### 10.1 Base URL & Versioning

```
Base URL: https://api.legacyasphere.com/v1
Auth:     Bearer <JWT access token>
Format:   application/json
Version:  URI versioning (/v1/, /v2/)
```

### 10.2 Authentication Endpoints

```yaml
POST /auth/register
  Request:
    body: { name, email, password, workspace_name }
  Response 201:
    { user: User, workspace: Workspace, access_token, refresh_token }
  Errors: 409 (email exists), 422 (validation)

POST /auth/login
  Request:
    body: { email, password }
  Response 200:
    { user: User, access_token, refresh_token, expires_at }
  Errors: 401 (invalid credentials), 429 (rate limited)

POST /auth/refresh
  Request:
    body: { refresh_token }
  Response 200:
    { access_token, refresh_token, expires_at }
  Errors: 401 (token expired/invalid)

POST /auth/logout
  Auth: Required
  Response 204: (token revoked)

POST /auth/forgot-password
  Request:
    body: { email }
  Response 200: { message: "Reset email sent if account exists" }

POST /auth/reset-password
  Request:
    body: { token, new_password }
  Response 200: { message: "Password updated" }
  Errors: 400 (token invalid/expired)
```

### 10.3 Metrics Endpoints

```yaml
GET /metrics/dashboard
  Auth: Required
  Description: Single endpoint returning all dashboard KPIs to minimize waterfall
  Response 200:
    {
      revenue_mtd: {
        value_cents: 2458000,
        currency: "USD",
        trend_percent: 12.4,
        trend_direction: "up",
        sparkline: [number, ...] // 30 data points
      },
      active_projects: {
        count: 8,
        trend_delta: 2,
        trend_direction: "up"
      },
      active_clients: {
        count: 14,
        trend_delta: 1,
        trend_direction: "up"
      },
      hours_logged: {
        current_week: 142.0,
        previous_week: 150.0,
        trend_delta: -8.0,
        trend_direction: "down",
        sparkline: [number, ...] // 7 data points
      }
    }
  Cache: 5 minutes

GET /metrics/revenue/chart
  Auth: Required
  Query: period=7d|30d|90d
  Response 200:
    {
      labels: ["Mon", "Tue", ...],
      values: [number, ...],      // in cents
      projected_total_cents: number,
      period_total_cents: number,
      currency: "USD"
    }
  Cache: 5 minutes
```

### 10.4 Projects Endpoints

```yaml
GET /projects
  Auth: Required
  Query:
    status: string[] (multi-value)
    client_id: UUID
    sort_by: due_date|created_at|name|status
    sort_dir: asc|desc
    page: int (default 1)
    limit: int (default 20, max 100)
    search: string
  Response 200:
    {
      data: Project[],
      meta: { total, page, limit, total_pages, has_next }
    }

POST /projects
  Auth: Required
  Request:
    {
      name, client_id, project_type, description?,
      start_date?, due_date?, budget_cents?, currency?,
      estimated_hours?, priority?, assigned_user_ids?[]
    }
  Response 201: Project
  Errors: 422 (validation), 404 (client not found)

GET /projects/:id
  Auth: Required
  Response 200: Project (full detail with members, time_entries summary)
  Errors: 404, 403 (wrong workspace)

PATCH /projects/:id
  Auth: Required (role: manager or owner)
  Request: Partial<Project>
  Response 200: Project
  Side effects: Creates activity_log entry, sends notifications

DELETE /projects/:id
  Auth: Required (role: owner or admin)
  Response 204
  Note: Soft delete — sets archived_at timestamp
```

### 10.5 Clients Endpoints

```yaml
GET /clients
  Auth: Required
  Query: status, search, page, limit
  Response 200: { data: Client[], meta }

POST /clients
  Auth: Required
  Request: { name, company_name?, email?, phone?, ... }
  Response 201: Client

GET /clients/:id
  Auth: Required
  Response 200: Client with projects[] and payment_summary

PATCH /clients/:id
  Auth: Required
  Response 200: Client

DELETE /clients/:id
  Auth: Required (role: admin)
  Response 204 (soft delete)
```

### 10.6 Tasks Endpoints

```yaml
GET /tasks
  Auth: Required
  Query:
    due_date: YYYY-MM-DD (default: today)
    status: pending|in_progress|done|cancelled
    project_id: UUID
    user_id: UUID (default: current user)
  Response 200: { data: Task[] }

POST /tasks
  Auth: Required
  Request: { title, priority?, due_date?, due_time?, project_id? }
  Response 201: Task

PATCH /tasks/:id
  Auth: Required (task owner or admin)
  Request: Partial<Task>
  Response 200: Task

PATCH /tasks/reorder
  Auth: Required
  Request: { task_ids: UUID[] }  // ordered array
  Response 200: { updated: number }

DELETE /tasks/:id
  Auth: Required (task owner or admin)
  Response 204
```

### 10.7 Revenue & Invoices Endpoints

```yaml
GET /invoices
  Auth: Required
  Query: status, client_id, project_id, page, limit
  Response 200: { data: Invoice[], meta }

POST /invoices
  Auth: Required
  Request: { project_id?, client_id, line_items[], due_date?, notes? }
  Response 201: Invoice

PATCH /invoices/:id
  Auth: Required
  Request: Partial<Invoice>
  Response 200: Invoice

POST /invoices/:id/mark-paid
  Auth: Required
  Request: { payment_date, payment_method, reference? }
  Response 200: { invoice: Invoice, payment: Payment }

GET /payments
  Auth: Required
  Query: client_id, project_id, date_from, date_to, page, limit
  Response 200: { data: Payment[], meta }

POST /payments
  Auth: Required
  Request: { client_id, project_id?, invoice_id?, amount_cents, currency, payment_date, payment_method }
  Response 201: Payment
```

### 10.8 Time Entries Endpoints

```yaml
GET /time-entries
  Auth: Required
  Query: project_id, user_id, date_from, date_to, page, limit
  Response 200: { data: TimeEntry[], meta, total_hours }

POST /time-entries
  Auth: Required
  Request: { project_id, date, hours, description?, billable? }
  Response 201: TimeEntry

PATCH /time-entries/:id
  Auth: Required (entry owner or admin)
  Response 200: TimeEntry

DELETE /time-entries/:id
  Auth: Required (entry owner or admin)
  Response 204
```

### 10.9 Activity & Notifications Endpoints

```yaml
GET /activity
  Auth: Required
  Query: limit (default 20), cursor, entity_type
  Response 200: { data: Activity[], next_cursor, has_more }

GET /notifications
  Auth: Required
  Query: unread_only, limit
  Response 200: { data: Notification[], unread_count }

PATCH /notifications/:id/read
  Auth: Required
  Response 200: Notification

PATCH /notifications/read-all
  Auth: Required
  Response 200: { updated_count: number }
```

### 10.10 Search Endpoint

```yaml
GET /search
  Auth: Required
  Query:
    q: string (required, min 2 chars)
    types[]: project|client|task (default: all)
    limit: int (default 10, max 30)
  Response 200:
    {
      results: [
        {
          type: "project",
          id: UUID,
          title: string,
          subtitle: string,
          meta: { status, due_date, client_name },
          url: "/projects/:id"
        },
        ...
      ],
      total: number,
      query_time_ms: number
    }
```

### 10.11 Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ],
    "request_id": "req_abc123"
  }
}
```

---

## 11. Authentication & Authorization Model

### 11.1 Authentication Flow

```
1. User submits email + password
2. Server validates credentials, bcrypt comparison
3. Server issues:
   - Access Token: JWT, 15-minute TTL, signed with RS256
   - Refresh Token: Opaque random string, 30-day TTL, stored hashed in DB
4. Client stores:
   - Access Token: Memory only (never localStorage — XSS risk)
   - Refresh Token: httpOnly Secure cookie (CSRF-safe with SameSite=Strict)
5. All API requests include: Authorization: Bearer <access_token>
6. When access token expires, client silently refreshes via /auth/refresh
7. Logout: Server revokes refresh token, client clears memory
```

### 11.2 JWT Payload

```json
{
  "sub": "user_uuid",
  "workspace_id": "workspace_uuid",
  "role": "owner",
  "email": "user@example.com",
  "iat": 1717123456,
  "exp": 1717124356
}
```

### 11.3 Workspace Isolation

**Every database query MUST include a `workspace_id` filter.** This is the primary multi-tenancy security control. Enforce at the service layer, not just the controller.

```typescript
// CORRECT — always scope to workspace
const projects = await db.projects.findMany({
  where: { workspace_id: ctx.workspace_id, status: 'active' }
});

// WRONG — never query without workspace scope
const projects = await db.projects.findMany({
  where: { id: projectId }  // No workspace_id = data leak risk
});
```

### 11.4 OAuth (Future v1.1)

- Google OAuth 2.0 for social login
- GitHub OAuth for developer accounts
- All OAuth logins still create a user record and issue the same JWT

---

## 12. Role & Permission Matrix

### 12.1 Role Definitions

| Role | Description |
|---|---|
| `owner` | Workspace creator. Full access. Can delete workspace. |
| `admin` | Can manage all data and users. Cannot delete workspace. |
| `manager` | Can create/edit projects and clients. Can manage tasks for others. |
| `member` | Can log time, update own tasks, view all projects. |
| `viewer` | Read-only access. Cannot create or edit anything. |

### 12.2 Permission Matrix

| Action | owner | admin | manager | member | viewer |
|---|---|---|---|---|---|
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all projects | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit any project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete/archive project | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create/edit client | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete client | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create own tasks | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit others' tasks | ✅ | ✅ | ✅ | ❌ | ❌ |
| Log time | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit others' time | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create invoice | ✅ | ✅ | ✅ | ❌ | ❌ |
| Log payment | ✅ | ✅ | ✅ | ❌ | ❌ |
| View revenue data | ✅ | ✅ | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change member roles | ✅ | ✅ | ❌ | ❌ | ❌ |
| Workspace settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Billing / subscription | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete workspace | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 13. Testing Strategy

### 13.1 Testing Philosophy

Follow the **Testing Trophy** approach (Kent C. Dodds):
- More integration tests than unit tests
- Unit tests for complex pure business logic
- E2E tests for critical user journeys only

### 13.2 Test Layers

#### Layer 1 — Unit Tests

**What to test:**
- Revenue MTD calculation logic
- Date/timezone utility functions
- Trend percentage calculation
- Permission checking functions
- Token generation/validation

**Tool:** Vitest (TypeScript) or Jest
**Coverage target:** 80% for business logic modules

```typescript
// Example: Revenue MTD calculation
describe('calculateRevenueMtd', () => {
  it('sums confirmed payments in current month', () => { ... });
  it('excludes refunded payments', () => { ... });
  it('handles timezone correctly', () => { ... });
  it('returns 0 when no payments this month', () => { ... });
  it('calculates trend as Infinity-safe when previous=0', () => { ... });
});
```

#### Layer 2 — Integration Tests

**What to test:**
- All API endpoints (request → handler → database → response)
- Authentication flow (register, login, refresh, logout)
- Workspace isolation (user A cannot access workspace B data)
- Permission checks (member cannot create project)
- Database constraints (duplicate invoice number rejected)

**Tool:** Supertest + test database (PostgreSQL in Docker)
**Coverage target:** All API endpoints have at least one happy path + one error path test

```typescript
describe('POST /projects', () => {
  it('creates project and returns 201 with correct shape', async () => { ... });
  it('returns 422 when name is missing', async () => { ... });
  it('returns 404 when client_id does not exist in workspace', async () => { ... });
  it('returns 403 when user role is member', async () => { ... });
  it('returns 401 when no auth token', async () => { ... });
  it('creates activity_log entry on success', async () => { ... });
  it('scopes to workspace — cannot use client from different workspace', async () => { ... });
});
```

#### Layer 3 — End-to-End Tests

**What to test (Critical User Journeys only):**
1. User registers → creates workspace → lands on dashboard
2. User creates a project → assigns to client → dashboard count updates
3. User logs a payment → Revenue MTD updates immediately
4. User searches for a project → clicks result → navigates to project
5. User invites a team member → member accepts → member sees workspace

**Tool:** Playwright
**Run:** On every PR, blocks merge if failing

### 13.3 Test Data Strategy

- Use **factories** to generate test data (e.g., `createTestWorkspace()`, `createTestProject()`)
- Seed a consistent test database with known data before each test suite
- Never use production data in tests
- Each test that modifies data runs in a **database transaction**, rolled back after

### 13.4 Security Testing

- **OWASP Top 10** manual review before first production release
- **Automated scanning:** SAST via CodeQL in CI pipeline
- **Dependency scanning:** Dependabot or Snyk for known CVEs
- **Penetration testing:** Before public launch (hire external security firm or use HackerOne)

### 13.5 Performance Testing

- **Load testing:** k6 or Artillery targeting 500 concurrent users
- **Stress testing:** Find the breaking point before launch
- **Database query analysis:** EXPLAIN ANALYZE on all queries used by dashboard metrics
- **Target:** p99 response time < 1000ms under 500 concurrent users

---

## 14. Deployment Strategy

### 14.1 Recommended Tech Stack

| Layer | Recommended | Alternative |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Remix, SvelteKit |
| Backend API | Node.js + Fastify or Express | Python + FastAPI |
| Database | PostgreSQL 15 (Supabase or Neon) | PlanetScale |
| Cache | Redis (Upstash) | Valkey |
| Auth | NextAuth.js or custom JWT | Clerk, Auth0 |
| File storage | AWS S3 or Supabase Storage | Cloudflare R2 |
| Email | Resend or Postmark | SendGrid |
| Real-time | Supabase Realtime or Ably | Pusher |
| Hosting | Vercel (frontend) + Railway or Fly.io (API) | AWS, GCP |
| CDN | Vercel Edge Network | Cloudflare |
| Monitoring | Sentry + Datadog | Grafana + Prometheus |

### 14.2 Environment Strategy

| Environment | Purpose | Database | Access |
|---|---|---|---|
| `local` | Individual developer machines | Docker PostgreSQL | Developer only |
| `development` | Shared integration environment | Dev DB (cloud) | Dev team |
| `staging` | Pre-release validation | Staging DB (anonymized prod copy) | QA + PM |
| `production` | Live user-facing | Production DB | Zero direct access |

### 14.3 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
DATABASE_SHADOW_URL=postgresql://...

# Auth
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...
REFRESH_TOKEN_SECRET=...
SESSION_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://app.legacyasphere.com
API_URL=https://api.legacyasphere.com
ALLOWED_ORIGINS=https://app.legacyasphere.com

# Email
RESEND_API_KEY=...
EMAIL_FROM=noreply@legacyasphere.com

# Storage
AWS_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Cache
REDIS_URL=redis://...

# Monitoring
SENTRY_DSN=...
DATADOG_API_KEY=...

# Feature flags
FF_AI_ASSISTANT=false
FF_MULTI_CURRENCY=false
```

### 14.4 CI/CD Pipeline

```yaml
# GitHub Actions Pipeline

on: [push, pull_request]

stages:
  1. lint:
     - ESLint
     - TypeScript type check
     - Prettier format check

  2. test:
     - Start PostgreSQL service container
     - Run database migrations
     - Run unit tests (Vitest)
     - Run integration tests (Supertest)
     - Upload coverage to Codecov
     - Fail if coverage < 70%

  3. security:
     - CodeQL SAST scan
     - npm audit
     - Snyk vulnerability scan

  4. build:
     - Build Next.js production bundle
     - Build Docker image (API)
     - Tag with commit SHA

  5. deploy-staging: (on push to main)
     - Run database migrations on staging
     - Deploy frontend to Vercel Preview
     - Deploy API to Railway staging
     - Run E2E tests against staging
     - Notify Slack on success/failure

  6. deploy-production: (manual approval required)
     - Require 2 approvals in GitHub
     - Run database migrations (with rollback plan)
     - Blue-green deployment (zero downtime)
     - Run smoke tests
     - Alert on error rate spike
     - Auto-rollback if health checks fail
```

### 14.5 Database Migration Strategy

- Use **Prisma Migrate** or **Flyway** for versioned migrations
- Every migration has a corresponding **rollback migration**
- Test migrations on staging before production
- Never run `DROP COLUMN` directly — add `_deprecated` suffix, keep for 2 releases, then drop
- All schema changes go through PR review

### 14.6 Zero-Downtime Deployment

1. Deploy new backend version alongside old version (blue-green)
2. Run database migrations that are backward-compatible with old code
3. Health check passes on new version
4. Switch load balancer to new version
5. Old version stays alive for 5 minutes (handles in-flight requests)
6. Decommission old version

---

## 15. Monitoring Strategy

### 15.1 Monitoring Layers

#### Application Performance Monitoring (APM)
- **Tool:** Sentry (error tracking + performance)
- Track: Error rate, P50/P95/P99 response times, slow transactions
- Alert: Error rate > 1% → PagerDuty → on-call engineer

#### Infrastructure Monitoring
- **Tool:** Datadog or Grafana Cloud
- Track: CPU, memory, database connections, cache hit rate, disk I/O
- Alert: Database connection pool > 80% utilization

#### Uptime Monitoring
- **Tool:** Better Uptime or Pingdom
- Check: `/health` endpoint every 60 seconds from multiple regions
- Alert: Downtime > 30 seconds → SMS + Slack

#### Business Metrics Dashboard
- **Tool:** Mixpanel or Amplitude
- Track: New registrations, DAU/MAU, projects created, revenue logged, feature adoption rates
- Alert: DAU drops > 20% vs. previous week

#### Database Monitoring
- **Tool:** pgAnalyze or built-in Supabase observability
- Track: Slow queries (> 500ms), index usage, table bloat, lock contention
- Alert: Query p99 > 1000ms

### 15.2 Key Metrics to Track (Business)

| Metric | Description | Target |
|---|---|---|
| DAU | Daily Active Users | Growing MoM |
| Projects Created / Day | Product engagement | > 5 per active workspace |
| Revenue Logged / Day | Core feature usage | > 1 per active workspace |
| Task Completion Rate | Task feature engagement | > 60% of created tasks |
| Search Usage Rate | Search adoption | > 30% of DAU |
| Notification Read Rate | Notification quality | > 50% |
| Churn Rate | Monthly cancellations | < 5% |

### 15.3 Health Check Endpoint

```
GET /health
Response 200:
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-06-08T00:00:00Z",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "external_services": "ok"
  }
}
```

### 15.4 Logging Strategy

- **Format:** Structured JSON logs (never plain text in production)
- **Fields:** `timestamp`, `level`, `message`, `request_id`, `user_id`, `workspace_id`, `duration_ms`
- **Levels:** ERROR, WARN, INFO, DEBUG
- **Production:** INFO and above only
- **Retention:** 30 days hot, 1 year cold (S3/GCS)
- **PII in logs:** Never log passwords, tokens, full payment details

---

## 16. Production Readiness Checklist

### Security

- [ ] All API endpoints require authentication (no accidental public routes)
- [ ] All queries include `workspace_id` scope
- [ ] Input validation on all API endpoints (Zod or Joi schemas)
- [ ] Rate limiting enabled (per user and per IP)
- [ ] HTTPS enforced (HSTS header)
- [ ] CSRF protection (SameSite cookies)
- [ ] XSS prevention (CSP headers)
- [ ] SQL injection prevention (ORM with parameterized queries)
- [ ] Secrets in environment variables (never in code or git)
- [ ] Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] Dependency vulnerability scan passing (Snyk / npm audit)
- [ ] OWASP Top 10 manual review completed

### Authentication

- [ ] Registration flow with email verification
- [ ] Login with secure password hashing (bcrypt, cost ≥ 12)
- [ ] JWT access tokens (15-minute TTL)
- [ ] Refresh token rotation (30-day TTL, httpOnly cookie)
- [ ] Password reset via email token
- [ ] Account lockout after 5 failed attempts
- [ ] Logout revokes refresh token

### Data

- [ ] All tables have `workspace_id` foreign key
- [ ] Database migrations tested on staging before production
- [ ] Database backups configured (daily, 30-day retention)
- [ ] Point-in-time recovery enabled
- [ ] No PII in logs
- [ ] Data encryption at rest confirmed
- [ ] Data encryption in transit (TLS 1.3)

### Performance

- [ ] Database indexes reviewed (all FK columns, common query patterns)
- [ ] Dashboard metrics API < 500ms in load testing
- [ ] No N+1 query patterns (use EXPLAIN ANALYZE)
- [ ] CDN configured for static assets
- [ ] Image optimization (Next.js Image or similar)
- [ ] API response caching for metrics endpoints (5-minute TTL)

### Reliability

- [ ] Health check endpoint returns correct status
- [ ] Uptime monitoring configured
- [ ] Error tracking (Sentry) integrated and tested
- [ ] Alerting configured (error rate, downtime)
- [ ] CI/CD pipeline passes on main branch
- [ ] Zero-downtime deployment strategy tested

### Frontend (Current Single HTML File)

- [ ] Tailwind CSS built via CLI (not CDN) for production
- [ ] JavaScript split into modules (ESM or bundled)
- [ ] Code splitting / lazy loading for modals
- [ ] Bundle size < 200KB gzipped
- [ ] All mock data removed
- [ ] API client integrated
- [ ] Loading skeletons for async data
- [ ] Error states for all data-fetching components
- [ ] Empty states for all list components

### Testing

- [ ] Unit test coverage ≥ 70% on business logic
- [ ] All API endpoints have integration tests
- [ ] Critical user journeys covered by E2E tests
- [ ] Tests pass in CI on every PR
- [ ] Security tests (SAST) passing

### Legal / Compliance

- [ ] Privacy Policy written and linked
- [ ] Terms of Service written and linked
- [ ] Cookie consent (if applicable to jurisdiction)
- [ ] GDPR data deletion mechanism implemented
- [ ] Data export mechanism implemented

---

## 17. SDLC Roadmap

### Phase 0 — Foundations (Weeks 1–2)

**Goal:** Set up everything that blocks engineering from starting.

| Task | Priority |
|---|---|
| Write formal PRD (this document) | P0 |
| Choose and document tech stack | P0 |
| Set up monorepo structure (frontend + API) | P0 |
| Configure ESLint, Prettier, TypeScript | P0 |
| Set up development database (Supabase local or Docker) | P0 |
| Write and apply initial database migrations | P0 |
| Set up GitHub Actions CI (lint + test pipeline) | P0 |
| Configure development environment (`.env` files) | P0 |

**Deliverable:** Engineers can clone repo, run `npm install && npm run dev`, and see a working local environment with a real database.

---

### Phase 1 — Authentication & Workspace (Weeks 3–4)

**Goal:** Real users can sign up, log in, and have a workspace.

| Task | Story | Priority |
|---|---|---|
| User registration API | US-001 | P0 |
| Email verification | US-001 | P0 |
| User login + JWT | US-002 | P0 |
| Refresh token rotation | US-002 | P0 |
| Password reset | US-003 | P0 |
| Workspace creation on register | US-006 | P0 |
| Auth middleware for all protected routes | — | P0 |
| Frontend: Login page | US-002 | P0 |
| Frontend: Register page | US-001 | P0 |
| Frontend: Redirect to dashboard after auth | US-002 | P0 |

**Deliverable:** User can sign up with email, verify email, log in, and see the dashboard (still with mock data at this stage).

---

### Phase 2 — Core Data Layer (Weeks 5–7)

**Goal:** Replace all mock data with real data from the database.

| Task | Story | Priority |
|---|---|---|
| Clients CRUD API | US-030–034 | P0 |
| Projects CRUD API | US-020–027 | P0 |
| Tasks CRUD API | US-040–046 | P0 |
| Dashboard metrics API (single endpoint) | US-010–018 | P0 |
| Activity log (auto-generated on mutations) | US-070 | P0 |
| Frontend: API client setup (fetch/axios + auth headers) | — | P0 |
| Frontend: Replace mock data with API calls | — | P0 |
| Frontend: Loading skeletons for all async sections | — | P0 |
| Frontend: Error states for all sections | — | P0 |
| Frontend: Empty states for all list sections | — | P0 |
| Integration tests for all new endpoints | — | P1 |

**Deliverable:** All dashboard data is real. A user who logs in sees their actual projects, clients, and tasks.

---

### Phase 3 — Revenue & Time Tracking (Weeks 8–9)

**Goal:** Revenue MTD and Hours Logged show real numbers.

| Task | Story | Priority |
|---|---|---|
| Invoices CRUD API | US-054–055 | P0 |
| Payments API | US-050–053 | P0 |
| Revenue MTD calculation | US-010–011 | P0 |
| Revenue chart data API | US-016–018 | P0 |
| Time entries CRUD API | US-060–064 | P0 |
| Hours logged calculation | US-061 | P0 |
| Frontend: Revenue chart connected to real data | US-016 | P0 |
| Frontend: Add time entry flow | US-060 | P1 |
| Frontend: Log payment flow | US-050 | P1 |

**Deliverable:** Revenue MTD and Hours Logged reflect real user input.

---

### Phase 4 — Search & Notifications (Weeks 10–11)

**Goal:** Search works across real data. Notifications are real-time.

| Task | Story | Priority |
|---|---|---|
| Search API (PostgreSQL FTS) | US-080–083 | P0 |
| Frontend: Search results rendering | US-081 | P0 |
| Notifications API | US-071–074 | P0 |
| Notification bell badge (unread count) | US-074 | P0 |
| Real-time delivery (SSE or WebSocket) | US-071 | P1 |
| Mark notifications as read | US-073 | P1 |

---

### Phase 5 — Team Management (Weeks 12–13)

**Goal:** Invite team members, enforce role-based permissions.

| Task | Story | Priority |
|---|---|---|
| Invite member API | US-004 | P1 |
| Accept invitation flow | US-005 | P1 |
| Role-based permission middleware | — | P0 |
| Member management UI | US-004 | P1 |
| Frontend: Permission-aware rendering (hide buttons based on role) | — | P1 |

---

### Phase 6 — Production Hardening (Weeks 14–15)

**Goal:** Ready for first paying customers.

| Task | Priority |
|---|---|
| Replace Tailwind CDN with Tailwind CLI build | P0 |
| Componentize frontend into proper framework (Next.js) | P0 |
| Rate limiting (express-rate-limit or nginx) | P0 |
| Security headers (Helmet.js or equivalent) | P0 |
| OWASP Top 10 review | P0 |
| E2E tests (Playwright) for 5 critical journeys | P1 |
| Uptime monitoring (Better Uptime) | P1 |
| Error tracking (Sentry) | P1 |
| Performance testing (k6) | P1 |
| Database index optimization | P1 |
| Privacy Policy + Terms of Service | P0 |
| GDPR data deletion endpoint | P1 |

---

### Phase 7 — Soft Launch (Week 16)

**Goal:** First 10 beta customers using the product.

| Task |
|---|
| Deploy to production (Vercel + Railway/Fly.io) |
| Custom domain (legacyasphere.com) |
| SSL certificate |
| Billing integration (Stripe) |
| Onboarding email sequence |
| In-app onboarding checklist (new user) |
| Feature flag system for gradual rollout |
| Feedback collection mechanism |

---

### Milestone Summary

| Milestone | Target | Deliverable |
|---|---|---|
| M0: Foundations | Week 2 | Dev environment running, database seeded |
| M1: Auth | Week 4 | Login/Register/Workspace working |
| M2: Real Data | Week 7 | All mock data replaced with database |
| M3: Revenue & Time | Week 9 | Financial metrics are real |
| M4: Search + Notifs | Week 11 | Full feature set complete |
| M5: Team Mgmt | Week 13 | Multi-user workspaces work |
| M6: Production | Week 15 | Security hardened, tests passing |
| M7: Launch | Week 16 | First beta users |

---

## Appendix A — Current Codebase Quick Facts

| Item | Value |
|---|---|
| Architecture | Single HTML file (monolith) |
| Lines of code | ~1,360 |
| File size | 71KB |
| JavaScript framework | Vanilla JS (no framework) |
| CSS | Tailwind CSS via CDN |
| Data persistence | localStorage only |
| Backend | None |
| Database | None |
| Authentication | None |
| Build process | None |
| Tests | None |
| Dependencies | Tailwind CDN, Lucide CDN, Google Fonts |

## Appendix B — Technical Debt Inventory (Current Prototype)

| Debt Item | Risk | Effort to Fix |
|---|---|---|
| Tailwind CDN (not production-safe) | Medium | Low |
| All data hardcoded (no API) | Critical | High |
| No authentication | Critical | High |
| localStorage-only persistence | High | High |
| No input validation on forms | High | Medium |
| Monolith HTML file (no components) | Medium | High |
| No error states in UI | Medium | Medium |
| No loading states in UI | Medium | Medium |
| No empty states in UI | Low | Medium |
| No accessibility audit | Medium | Medium |
| No CSRF protection on forms | High | Low |
| Inline SVG charts (not a charting library) | Low | Medium |

## Appendix C — Recommended File Structure (Production)

```
legacyasphere/
├── apps/
│   ├── web/                      # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx      # Main dashboard
│   │   │   │   ├── projects/
│   │   │   │   ├── clients/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── ProjectsTable.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   ├── ui/               # Reusable design system
│   │   │   └── modals/
│   │   └── lib/
│   │       ├── api.ts            # API client
│   │       ├── auth.ts           # Auth utilities
│   │       └── hooks/
│   └── api/                      # Fastify or Express API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── projects.ts
│       │   │   ├── clients.ts
│       │   │   ├── tasks.ts
│       │   │   ├── metrics.ts
│       │   │   └── search.ts
│       │   ├── services/
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   └── workspace.ts
│       │   └── db/
│       │       ├── schema.prisma
│       │       └── migrations/
│       └── tests/
├── packages/
│   ├── types/                    # Shared TypeScript types
│   └── config/                   # Shared ESLint, TS config
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
└── package.json                  # Turborepo root
```

---

*This document was generated as part of the LegacyaSphere SDLC audit on 2026-06-08.*
*It is a living document — update it as decisions are made and requirements evolve.*
