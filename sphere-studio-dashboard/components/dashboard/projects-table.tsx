import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ProjectRow {
  id: string
  name: string
  client_name: string | null
  status: string
  due_date: string | null
}

interface ProjectsTableProps {
  projects: ProjectRow[]
  totalCount: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  in_progress:       { label: 'In Progress',       color: '#4f46e5' },
  in_review:         { label: 'In Review',          color: '#f59e0b' },
  in_revision:       { label: 'In Revision',        color: '#f97316' },
  awaiting_feedback: { label: 'Awaiting Feedback',  color: '#8b5cf6' },
  planning:          { label: 'Planning',           color: '#64748b' },
  complete:          { label: 'Complete',           color: '#10b981' },
  archived:          { label: 'Archived',           color: '#a3a3a3' },
}

function dueDateStyle(dateStr: string | null): React.CSSProperties {
  if (!dateStr) return { color: 'var(--hs-neutral-400)' }
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff <= 3) return { color: '#f43f5e', fontWeight: 500 }
  if (diff <= 7) return { color: '#f59e0b', fontWeight: 500 }
  return { color: 'var(--hs-neutral-400)' }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ProjectsTable({ projects, totalCount }: ProjectsTableProps) {
  return (
    <section
      className="bg-white rounded-[14px]"
      style={{ border: '1px solid var(--hs-neutral-200)', boxShadow: 'var(--hs-shadow-card)' }}
    >
      <div className="flex items-center justify-between px-5 sm:px-6 py-5">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--hs-neutral-900)' }}>
            Active Projects
          </h2>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            {totalCount} in flight
          </p>
        </div>
        <Link
          href="/projects"
          className="text-[12px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] rounded"
          style={{ color: 'var(--hs-neutral-500)' }}
        >
          View all
        </Link>
      </div>

      <div style={{ borderTop: '1px solid var(--hs-neutral-100)' }}>
        {projects.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] font-light" style={{ color: 'var(--hs-neutral-400)' }}>
            No active projects
          </div>
        ) : (
          projects.map((p) => {
            const sc = STATUS_CONFIG[p.status] ?? { label: p.status, color: '#a3a3a3' }
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="project-row flex items-center gap-3 px-5 sm:px-6 py-3.5 group"
                style={{ borderBottom: '1px solid var(--hs-neutral-100)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'var(--hs-neutral-800)' }}>
                    {p.name}
                  </p>
                  {p.client_name && (
                    <p className="text-[11px] truncate font-light" style={{ color: 'var(--hs-neutral-400)' }}>
                      {p.client_name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                  <span className="text-[12px]" style={{ color: 'var(--hs-neutral-600)' }}>
                    {sc.label}
                  </span>
                </div>
                <span
                  className="text-[12px] tabular-nums w-16 text-right shrink-0"
                  style={dueDateStyle(p.due_date)}
                >
                  {formatDate(p.due_date)}
                </span>
                <ChevronRight
                  style={{ width: 14, height: 14, color: 'var(--hs-neutral-300)' }}
                  className="shrink-0 transition group-hover:translate-x-0.5"
                />
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
