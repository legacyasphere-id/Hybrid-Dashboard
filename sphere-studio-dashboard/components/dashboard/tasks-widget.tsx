import Link from 'next/link'

interface TaskItem {
  id: string
  title: string
  priority: string
  due_date: string | null
  project_name: string | null
}

interface TasksWidgetProps {
  tasks: TaskItem[]
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: '#f43f5e',
  high:   '#f59e0b',
  normal: '#d4d4d4',
  low:    '#d4d4d4',
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function TasksWidget({ tasks }: TasksWidgetProps) {
  return (
    <section
      className="bg-white rounded-[14px] p-5 sm:p-6 flex flex-col"
      style={{ border: '1px solid var(--hs-neutral-200)', boxShadow: 'var(--hs-shadow-card)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--hs-neutral-900)' }}>
            Today
          </h2>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/tasks"
          className="text-[12px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] rounded"
          style={{ color: 'var(--hs-neutral-500)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--hs-neutral-900)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--hs-neutral-500)' }}
        >
          View all
        </Link>
      </div>

      {/* Priority legend */}
      <div className="flex items-center gap-3 mb-3 text-[11px] font-light" style={{ color: 'var(--hs-neutral-400)' }}>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f43f5e' }} />
          Urgent
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b' }} />
          High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#d4d4d4' }} />
          Normal
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8 text-[13px] font-light" style={{ color: 'var(--hs-neutral-400)' }}>
          No tasks due today
        </div>
      ) : (
        <ul className="space-y-1 flex-1">
          {tasks.map((task) => (
            <li key={task.id} className="task-row flex items-center gap-2.5 px-2 py-2 rounded-[8px] group">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: PRIORITY_COLOR[task.priority] ?? '#d4d4d4' }}
              />
              <span className="flex-1 text-[13px] truncate" style={{ color: 'var(--hs-neutral-700)' }}>
                {task.title}
              </span>
              {task.due_date && (
                <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--hs-neutral-400)' }}>
                  {formatTime(task.due_date)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
