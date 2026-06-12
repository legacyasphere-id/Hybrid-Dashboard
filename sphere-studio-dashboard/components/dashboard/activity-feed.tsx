import type { ActivityEntry } from '@/services/dashboard'

interface ActivityFeedProps {
  entries: ActivityEntry[]
}

const ENTITY_COLOR: Record<string, string> = {
  project: '#4f46e5',
  task:    '#f59e0b',
  client:  '#10b981',
  member:  '#8b5cf6',
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function actionLabel(action: string, entityType: string): string {
  const labels: Record<string, string> = {
    created: 'created a',
    updated: 'updated a',
    deleted: 'deleted a',
    completed: 'completed a',
    invited: 'invited a',
  }
  return `${labels[action] ?? action} ${entityType}`
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <section
      className="bg-white rounded-[14px] p-5 sm:p-6"
      style={{ border: '1px solid var(--hs-neutral-200)', boxShadow: 'var(--hs-shadow-card)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--hs-neutral-900)' }}>
            Activity
          </h2>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            Recent updates
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-[13px] font-light text-center py-6" style={{ color: 'var(--hs-neutral-400)' }}>
          No recent activity
        </p>
      ) : (
        <ol className="activity-list space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 relative pl-4">
              <span
                className="absolute left-0 top-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ background: ENTITY_COLOR[entry.entity_type] ?? '#a3a3a3' }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--hs-neutral-700)' }}>
                  <span className="font-medium">{entry.actor_name ?? entry.actor_email}</span>{' '}
                  {actionLabel(entry.action, entry.entity_type)}
                </p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: 'var(--hs-neutral-400)' }}>
                  {relativeTime(entry.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
