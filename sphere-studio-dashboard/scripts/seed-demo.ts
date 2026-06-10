/**
 * Seed a demo workspace with realistic sample data.
 *
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SUPABASE_URL in environment (or .env.local)
 *   - SUPABASE_SERVICE_ROLE_KEY in environment (required for admin operations)
 *   - dotenv package: npm install --save-dev dotenv
 *
 * Creates:
 *   - 1 demo user  (demo@sphere.studio / Demo1234!)
 *   - 1 workspace  (Sphere Demo Studio)
 *   - 4 clients
 *   - 6 projects across different statuses
 *   - 18 tasks spread across projects
 *   - 10 activity log entries
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_EMAIL = 'demo@sphere.studio'
const DEMO_PASSWORD = 'Demo1234!'
const DEMO_NAME = 'Alex Rivera'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]!
}

function daysAgo(n: number): string {
  return daysFromNow(-n)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Seeding demo workspace…\n')

  // 1. Create or reuse demo user
  let userId: string

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', DEMO_EMAIL)
    .maybeSingle()

  if (existing) {
    userId = (existing as { id: string }).id
    console.log(`✓  Demo user already exists (${userId})`)
  } else {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: DEMO_NAME },
    })
    if (authError) throw new Error(`Auth user creation failed: ${authError.message}`)
    userId = authUser.user.id

    const { error: profileError } = await supabase.from('users').insert({
      id: userId,
      email: DEMO_EMAIL,
      full_name: DEMO_NAME,
    })
    if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)
    console.log(`✓  Created demo user ${DEMO_EMAIL} (${userId})`)
  }

  // 2. Create workspace (via DB function to handle owner bootstrap)
  const { data: wsId, error: wsError } = await supabase.rpc('create_workspace_for_user', {
    p_name: 'Sphere Demo Studio',
    p_slug: 'sphere-demo-studio',
  })
  // If it fails because slug exists, that's fine — look it up
  let workspaceId: string

  if (wsError) {
    const { data: ws } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', 'sphere-demo-studio')
      .maybeSingle()
    if (!ws) throw new Error(`Workspace creation failed: ${wsError.message}`)
    workspaceId = (ws as { id: string }).id
    console.log(`✓  Using existing workspace (${workspaceId})`)
  } else {
    workspaceId = wsId as string
    console.log(`✓  Created workspace (${workspaceId})`)
  }

  // 3. Clients
  const clients = [
    {
      name: 'Teal Horizon Co.',
      email: 'hello@tealhorizon.io',
      company: 'Teal Horizon Co.',
      website: 'https://tealhorizon.io',
      notes: 'Brand refresh + new website. Key contact: Maya Chen (CMO).',
    },
    {
      name: 'Kodo Fitness',
      email: 'design@kodofitness.com',
      company: 'Kodo Fitness',
      website: 'https://kodofitness.com',
      notes: 'Mobile app UI + marketing site. Tight deadline — March launch.',
    },
    {
      name: 'Groundwork Studio',
      email: 'studio@groundwork.co',
      company: 'Groundwork Studio',
      website: null,
      notes: 'Sub-contractor relationship. Handle their overflow web projects.',
    },
    {
      name: 'Nova Legal Group',
      email: null,
      company: 'Nova Legal Group',
      website: 'https://novalegal.co',
      notes: 'Referral from Teal Horizon. Initial consultation only so far.',
    },
  ]

  const { data: insertedClients, error: clientError } = await supabase
    .from('clients')
    .insert(
      clients.map((c) => ({
        ...c,
        workspace_id: workspaceId,
        created_by: userId,
      })),
    )
    .select('id, name')

  if (clientError) throw new Error(`Clients insert failed: ${clientError.message}`)

  const clientIds = (insertedClients as Array<{ id: string; name: string }>).reduce(
    (acc, c) => ({ ...acc, [c.name]: c.id }),
    {} as Record<string, string>,
  )
  console.log(`✓  Created ${clients.length} clients`)

  // 4. Projects
  const projectData = [
    {
      name: 'Teal Horizon — Brand Refresh',
      description: 'Full brand identity overhaul: logo, color palette, typography, brand guidelines.',
      status: 'in_review' as const,
      due_date: daysFromNow(14),
      client_name: 'Teal Horizon Co.',
    },
    {
      name: 'Teal Horizon — Website Redesign',
      description: 'Redesign and rebuild the marketing site on Webflow.',
      status: 'in_progress' as const,
      due_date: daysFromNow(45),
      client_name: 'Teal Horizon Co.',
    },
    {
      name: 'Kodo Fitness — Mobile App UI',
      description: 'UI design for iOS and Android fitness tracking app.',
      status: 'in_progress' as const,
      due_date: daysFromNow(30),
      client_name: 'Kodo Fitness',
    },
    {
      name: 'Kodo Fitness — Marketing Site',
      description: 'Launch page and marketing site for Kodo Fitness app.',
      status: 'planning' as const,
      due_date: daysFromNow(60),
      client_name: 'Kodo Fitness',
    },
    {
      name: 'Groundwork — Client Portal',
      description: 'Custom client portal for Groundwork Studio\'s own clients.',
      status: 'complete' as const,
      due_date: daysAgo(10),
      client_name: 'Groundwork Studio',
    },
    {
      name: 'Nova Legal — Brand Discovery',
      description: 'Discovery phase: stakeholder interviews, competitive audit, brand positioning.',
      status: 'awaiting_feedback' as const,
      due_date: daysFromNow(7),
      client_name: 'Nova Legal Group',
    },
  ]

  const { data: insertedProjects, error: projectError } = await supabase
    .from('projects')
    .insert(
      projectData.map((p) => ({
        name: p.name,
        description: p.description,
        status: p.status,
        due_date: p.due_date,
        workspace_id: workspaceId,
        client_id: clientIds[p.client_name] ?? null,
        created_by: userId,
      })),
    )
    .select('id, name')

  if (projectError) throw new Error(`Projects insert failed: ${projectError.message}`)

  const projectIds = (insertedProjects as Array<{ id: string; name: string }>).reduce(
    (acc, p) => ({ ...acc, [p.name]: p.id }),
    {} as Record<string, string>,
  )
  console.log(`✓  Created ${projectData.length} projects`)

  // 5. Tasks
  const now = new Date().toISOString()
  const taskData = [
    // Teal Horizon Brand Refresh (in_review)
    { title: 'Revise logo mark — client feedback round 2', project: 'Teal Horizon — Brand Refresh', status: 'in_review' as const, priority: 'high' as const, due_date: daysFromNow(3) },
    { title: 'Update color palette with accessibility contrast check', project: 'Teal Horizon — Brand Refresh', status: 'done' as const, priority: 'medium' as const, due_date: null, completed_at: daysAgo(2) },
    { title: 'Deliver final brand guidelines PDF', project: 'Teal Horizon — Brand Refresh', status: 'todo' as const, priority: 'high' as const, due_date: daysFromNow(14) },

    // Teal Horizon Website (in_progress)
    { title: 'Homepage wireframes', project: 'Teal Horizon — Website Redesign', status: 'done' as const, priority: 'high' as const, due_date: null, completed_at: daysAgo(5) },
    { title: 'Build homepage in Webflow', project: 'Teal Horizon — Website Redesign', status: 'in_progress' as const, priority: 'high' as const, due_date: daysFromNow(10) },
    { title: 'About + Services pages', project: 'Teal Horizon — Website Redesign', status: 'todo' as const, priority: 'medium' as const, due_date: daysFromNow(20) },
    { title: 'SEO meta tags and OG images', project: 'Teal Horizon — Website Redesign', status: 'todo' as const, priority: 'low' as const, due_date: daysFromNow(40) },

    // Kodo Fitness App (in_progress)
    { title: 'Onboarding flow — 5 screens', project: 'Kodo Fitness — Mobile App UI', status: 'done' as const, priority: 'urgent' as const, due_date: null, completed_at: daysAgo(7) },
    { title: 'Dashboard + workout tracker screens', project: 'Kodo Fitness — Mobile App UI', status: 'in_progress' as const, priority: 'high' as const, due_date: daysFromNow(5) },
    { title: 'Settings and profile screens', project: 'Kodo Fitness — Mobile App UI', status: 'todo' as const, priority: 'medium' as const, due_date: daysFromNow(12) },
    { title: 'Handoff Figma file to dev team', project: 'Kodo Fitness — Mobile App UI', status: 'todo' as const, priority: 'high' as const, due_date: daysFromNow(28) },

    // Kodo Marketing Site (planning)
    { title: 'Define site structure and key pages', project: 'Kodo Fitness — Marketing Site', status: 'todo' as const, priority: 'medium' as const, due_date: daysFromNow(25) },
    { title: 'Get copy from Kodo team', project: 'Kodo Fitness — Marketing Site', status: 'todo' as const, priority: 'low' as const, due_date: daysFromNow(20) },

    // Nova Legal Discovery (awaiting_feedback)
    { title: 'Competitive audit deck — 3 competitors', project: 'Nova Legal — Brand Discovery', status: 'done' as const, priority: 'medium' as const, due_date: null, completed_at: daysAgo(3) },
    { title: 'Stakeholder interview summary', project: 'Nova Legal — Brand Discovery', status: 'in_review' as const, priority: 'high' as const, due_date: daysFromNow(2) },
    { title: 'Brand positioning recommendation', project: 'Nova Legal — Brand Discovery', status: 'todo' as const, priority: 'high' as const, due_date: daysFromNow(7) },

    // Groundwork Portal (complete)
    { title: 'Deploy to production', project: 'Groundwork — Client Portal', status: 'done' as const, priority: 'urgent' as const, due_date: null, completed_at: daysAgo(10) },
    { title: 'Handover documentation', project: 'Groundwork — Client Portal', status: 'done' as const, priority: 'medium' as const, due_date: null, completed_at: daysAgo(10) },
  ]

  const { error: taskError } = await supabase.from('tasks').insert(
    taskData.map((t) => ({
      title: t.title,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date ?? null,
      completed_at: 'completed_at' in t ? t.completed_at + 'T00:00:00Z' : null,
      project_id: projectIds[t.project] ?? '',
      workspace_id: workspaceId,
      assignee_id: userId,
      created_by: userId,
    })),
  )
  if (taskError) throw new Error(`Tasks insert failed: ${taskError.message}`)
  console.log(`✓  Created ${taskData.length} tasks`)

  // 6. Activity log
  const activities = [
    { entity_type: 'project', action: 'created', entity_name: 'Nova Legal — Brand Discovery' },
    { entity_type: 'task', action: 'completed', entity_name: 'Competitive audit deck' },
    { entity_type: 'project', action: 'updated', entity_name: 'Teal Horizon — Brand Refresh' },
    { entity_type: 'task', action: 'created', entity_name: 'Deliver final brand guidelines PDF' },
    { entity_type: 'client', action: 'created', entity_name: 'Nova Legal Group' },
    { entity_type: 'task', action: 'completed', entity_name: 'Homepage wireframes' },
    { entity_type: 'project', action: 'updated', entity_name: 'Kodo Fitness — Mobile App UI' },
    { entity_type: 'task', action: 'created', entity_name: 'Build homepage in Webflow' },
    { entity_type: 'client', action: 'updated', entity_name: 'Kodo Fitness' },
    { entity_type: 'project', action: 'created', entity_name: 'Kodo Fitness — Marketing Site' },
  ]

  const { error: activityError } = await supabase.from('activity_logs').insert(
    activities.map((a, i) => ({
      workspace_id: workspaceId,
      actor_id: userId,
      entity_type: a.entity_type,
      entity_id: workspaceId, // placeholder — real entity IDs not needed for demo
      action: a.action,
      metadata: { name: a.entity_name },
      created_at: new Date(Date.now() - i * 3_600_000).toISOString(),
    })),
  )
  if (activityError) throw new Error(`Activity logs insert failed: ${activityError.message}`)
  console.log(`✓  Created ${activities.length} activity log entries`)

  console.log('\n✅  Demo workspace seeded successfully!\n')
  console.log('   Email:    ', DEMO_EMAIL)
  console.log('   Password: ', DEMO_PASSWORD)
  console.log('   Workspace:', 'Sphere Demo Studio')
  console.log()
}

seed().catch((err: unknown) => {
  console.error('❌  Seed failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
