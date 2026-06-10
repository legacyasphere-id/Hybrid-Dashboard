# Sphere Studio Dashboard — Launch Checklist

## Manual QA Checklist

### Auth
- [ ] Sign up with email + password → email verification email received
- [ ] Sign up with email that already exists → friendly error shown
- [ ] Log in with correct credentials → redirect to `/dashboard`
- [ ] Log in with wrong password → friendly error shown
- [ ] Forgot password → reset email received → password updated → can log in
- [ ] Log out → redirect to `/login`
- [ ] Accessing `/dashboard` while logged out → redirect to `/login`
- [ ] Accessing `/login` while logged in → redirect to `/dashboard`

### Workspace
- [ ] New user with no workspace → redirect to `/workspace/new`
- [ ] Create workspace → redirect to `/dashboard` with workspace name in sidebar

### Dashboard
- [ ] Stats cards show correct counts (cross-check against Clients/Projects/Tasks pages)
- [ ] Activity feed shows most recent entries
- [ ] Upcoming Deadlines shows items sorted by due date ascending
- [ ] Empty state renders when no data exists (new workspace)
- [ ] Loading skeleton visible before data loads (throttle network)

### Clients
- [ ] Create client → appears in list immediately (optimistic)
- [ ] Edit client → changes persist on refresh
- [ ] Delete client → removed from list immediately, shows toast
- [ ] Search filters list in real time (debounced)
- [ ] Empty search result → empty state message shown
- [ ] No clients → empty state shown with CTA
- [ ] Pagination — more than 10 clients → prev/next works
- [ ] Client detail page shows correct project count

### Projects
- [ ] Create project → appears in list
- [ ] Status filter works correctly for each status value
- [ ] Client filter shows only clients in workspace
- [ ] Edit project → changes persist
- [ ] Delete project → removed from list, associated tasks removed
- [ ] Empty state shown when no projects
- [ ] Project detail shows correct task count and status badge

### Tasks
- [ ] Create task → requires project (link shown when no projects exist)
- [ ] Assignee dropdown shows current user's name (not blank)
- [ ] Status, priority filters work
- [ ] Edit task → changes persist
- [ ] Delete task → removed from list
- [ ] Marking task done sets `completed_at` (verify in Supabase)
- [ ] Marking done task back to in_progress clears `completed_at`
- [ ] Empty state shown when no tasks

### Settings — Profile
- [ ] Name update saves and reflects in sidebar after page refresh
- [ ] Email displayed as read-only (cannot be edited)
- [ ] Password reset email sent and received
- [ ] Avatar upload shows preview immediately
- [ ] Avatar upload > 2 MB → error message shown
- [ ] Avatar persists after page reload (URL is stable)

### Settings — Workspace (admin+ only)
- [ ] Member role user → redirected to `/settings/profile`
- [ ] Name + slug updates save and reflect after refresh
- [ ] Slug validation rejects spaces and special characters
- [ ] Plan shows correctly as badge (read-only)
- [ ] Danger zone only visible to owner role
- [ ] Delete workspace — typing wrong name keeps button disabled
- [ ] Delete workspace — correct name enables button → confirm → workspace deleted → redirect to `/workspace/new`

### Settings — Members (admin+ only)
- [ ] Member role user → redirected to `/settings/profile`
- [ ] Member list loads with correct roles and email addresses
- [ ] Invite by email — user exists → added immediately
- [ ] Invite by email — user doesn't exist → clear error toast
- [ ] Invite by email — already a member → clear error toast
- [ ] Role change (member ↔ admin) → reflects immediately
- [ ] Cannot change own role
- [ ] Cannot change owner role
- [ ] Remove member → removed from list immediately
- [ ] Cannot remove self

### Error States
- [ ] Supabase down → error boundary shows "Something went wrong" with retry button
- [ ] 404 route → not-found page shown with "Go to dashboard" link
- [ ] Form validation errors show inline with correct messages
- [ ] Server errors (e.g. duplicate slug) show as toast

### Loading States
- [ ] Dashboard loading skeleton visible on slow connections
- [ ] Clients list loading skeleton visible
- [ ] Projects list loading skeleton visible
- [ ] Tasks list loading skeleton visible
- [ ] Settings loading skeleton visible
- [ ] Submit buttons show spinner + disabled during mutation

### Responsive
- [ ] Mobile (375px): sidebar collapsed, menu button visible
- [ ] Mobile: hamburger opens/closes sidebar sheet
- [ ] Mobile: forms are full-width and usable
- [ ] Mobile: action buttons accessible (not cut off)
- [ ] Tablet (768px): layout switches to 1-col on settings
- [ ] Desktop (1024px+): sidebar visible, two-column settings layout

### Accessibility (manual)
- [ ] Tab through all interactive elements in logical order
- [ ] All icon-only buttons have sr-only label with context
- [ ] Focus rings visible on all interactive elements
- [ ] Error messages associated with inputs (screen reader reads them)
- [ ] Dialog traps focus when open
- [ ] Dialog returns focus to trigger on close
- [ ] Color is not the only indicator of state (badges have text labels)
- [ ] Contrast ratios meet WCAG 2.1 AA (check with browser devtools)

---

## Production Deployment Checklist

### Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set for production project
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set for production project
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (required for seed script and admin ops)
- [ ] No `.env.local` values hardcoded in source

### Supabase
- [ ] Production project created (separate from staging)
- [ ] All migrations applied to production via `supabase db push` or migration tool
- [ ] RLS enabled on all tenant tables: `clients`, `projects`, `tasks`, `workspace_members`, `workspaces`, `activity_logs`, `users`
- [ ] RLS policies verified: users cannot read other workspaces' data
- [ ] `avatars` storage bucket created with public read access
- [ ] Storage bucket policy: users can only write to their own `userId/` prefix
- [ ] Auth email templates customised (Supabase dashboard → Auth → Email Templates)
- [ ] Auth redirect URLs configured for production domain
- [ ] Google OAuth configured (if enabled): redirect URIs include production domain
- [ ] Database backups enabled (Supabase Pro feature)
- [ ] Point-in-time recovery window set (recommended: 7 days)

### Vercel
- [ ] Project connected to `legacyasphere-id/Hybrid-Dashboard` repo
- [ ] Root directory set to `sphere-studio-dashboard`
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next` (Next.js default)
- [ ] Custom domain configured and DNS propagated
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Preview deployments enabled for PR branch

### Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never exposed to client (server-only)
- [ ] No `console.log` calls that expose user data in production
- [ ] CSRF protection active (Supabase SSR handles via httpOnly cookies)
- [ ] Rate limiting on auth routes (Supabase built-in or custom middleware)
- [ ] Content Security Policy header configured (optional but recommended)

### Pre-launch
- [ ] Run `npm run build` locally — zero errors and zero warnings
- [ ] Run `npm run type-check` — zero errors
- [ ] Run `npm run lint` — zero warnings
- [ ] Complete QA checklist above on staging environment
- [ ] Test with a real invite flow (invite a second email address)
- [ ] Test workspace deletion and recreation
- [ ] Load test: create 50+ clients, verify pagination works
- [ ] Verify Supabase rate limits are acceptable for expected traffic
- [ ] Set up error monitoring (Sentry or Vercel monitoring)
- [ ] Set up uptime monitoring (Better Uptime or similar)

### Post-launch
- [ ] Monitor Supabase logs for errors (first 48 hours)
- [ ] Monitor Vercel function logs for errors
- [ ] Verify emails are delivered (check spam rates)
- [ ] Collect first user feedback (schedule 15-min call with first 3 users)

---

## Known Issues / Tech Debt

| Issue | Priority | Notes |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` blank in `.env.local` | High | Must be filled manually from Supabase dashboard before running seed script |
| `types/database.ts` hand-written | Medium | Run `npx supabase gen types typescript --project-id xakzoieksppiocaxdfhu` to regenerate from live schema |
| Avatar bucket not yet created | High | Create `avatars` bucket in Supabase Storage with public read + user-scoped write policy |
| Invite flow requires signup first | Medium | No email invite — invitee must have an account. Document this for first users. |
| No email sending infrastructure | Medium | Password reset works via Supabase built-in. Custom transactional emails (welcome, etc.) require Resend/SendGrid setup. |
| No error monitoring | Medium | Add Sentry before first external users |
| Workspace context goes stale after update | Low | `router.refresh()` is called after workspace/profile updates; sidebar updates on next render |
