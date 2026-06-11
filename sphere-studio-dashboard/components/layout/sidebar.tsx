'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Settings,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Clients',   href: '/clients',    icon: Users },
  { label: 'Projects',  href: '/projects',   icon: FolderKanban },
  { label: 'Tasks',     href: '/tasks',      icon: CheckSquare },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Primary nav */}
      <nav className="flex-1 px-3 space-y-0.5" aria-label="Primary navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
              style={
                isActive
                  ? { background: 'rgba(255,255,255,0.10)', color: '#ffffff', fontWeight: 500 }
                  : { color: '#a3a3a3', fontWeight: 400 }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#ffffff'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#a3a3a3'
                }
              }}
            >
              <Icon style={{ width: 16, height: 16 }} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-0.5">
        <Link
          href="/settings"
          onClick={onNavigate}
          aria-current={pathname.startsWith('/settings') ? 'page' : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          style={
            pathname.startsWith('/settings')
              ? { background: 'rgba(255,255,255,0.10)', color: '#ffffff', fontWeight: 500 }
              : { color: '#a3a3a3' }
          }
          onMouseEnter={(e) => {
            if (!pathname.startsWith('/settings')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = '#ffffff'
            }
          }}
          onMouseLeave={(e) => {
            if (!pathname.startsWith('/settings')) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#a3a3a3'
            }
          }}
        >
          <Settings style={{ width: 16, height: 16 }} />
          <span>Settings</span>
        </Link>

        {/* AI card */}
        <div
          className="mt-3 p-3 rounded-[10px]"
          style={{
            background: 'linear-gradient(135deg, #262626, rgba(38,38,38,0.5))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1" style={{ color: '#a5b4fc' }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            AI Assistant
          </div>
          <div className="text-[11px] leading-relaxed mb-2.5 font-light" style={{ color: '#a3a3a3' }}>
            Draft proposals &amp; client emails in seconds.
          </div>
          <button
            className="text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] rounded"
            style={{ color: '#c7d2fe' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#c7d2fe' }}
          >
            Draft with AI →
          </button>
        </div>
      </div>
    </div>
  )
}
