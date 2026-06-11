'use client'

import { useState } from 'react'
import { Menu, Search, Bell, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher'
import { SidebarNav } from '@/components/layout/sidebar'
import { UserMenu } from '@/components/layout/user-menu'

interface AppShellProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    fullName: string | null
  }
  workspace: {
    id: string
    name: string
    slug: string
    plan: string
  }
  role: string
}

function getInitials(email: string, fullName: string | null): string {
  if (fullName) {
    const parts = fullName.trim().split(' ')
    const first = parts[0]?.[0] ?? ''
    const last = parts[parts.length - 1]?.[0] ?? ''
    return (first + last).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

function useBreadcrumb(workspaceName: string) {
  const pathname = usePathname()
  const segments: { label: string; href?: string }[] = [
    { label: workspaceName },
  ]
  const map: Record<string, string> = {
    '/dashboard':  'Dashboard',
    '/clients':    'Clients',
    '/projects':   'Projects',
    '/tasks':      'Tasks',
    '/settings':   'Settings',
  }
  for (const [prefix, label] of Object.entries(map)) {
    if (pathname.startsWith(prefix)) {
      segments.push({ label })
      break
    }
  }
  return segments
}

function SidebarContent({
  user,
  workspace,
  role,
  onNavigate,
}: Omit<AppShellProps, 'children'> & { onNavigate?: () => void }) {
  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: '#111111',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        color: '#a3a3a3',
      }}
    >
      {/* Workspace switcher */}
      <div className="px-4 pt-5 pb-4">
        <WorkspaceSwitcher name={workspace.name} plan={workspace.plan} />
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <button
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#a3a3a3' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <Search style={{ width: 14, height: 14 }} />
          <span className="flex-1 text-left">Search</span>
          <kbd
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#a3a3a3' }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav + footer */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      {/* User */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <UserMenu email={user.email} fullName={user.fullName} role={role} />
      </div>
    </div>
  )
}

export function AppShell({ children, user, workspace, role }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const breadcrumb = useBreadcrumb(workspace.name)
  const initials = getInitials(user.email, user.fullName)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--hs-neutral-50)' }}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop fixed, mobile slide-in */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          user={user}
          workspace={workspace}
          role={role}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-[240px]">

        {/* Topbar */}
        <header
          className="sticky top-0 z-40 h-14 px-4 lg:px-8 flex items-center justify-between bg-white"
          style={{ borderBottom: '1px solid var(--hs-neutral-200)' }}
        >
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 -ml-1.5 rounded-[6px] transition-colors hover:bg-[var(--hs-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] focus-visible:ring-offset-2"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>
            <div
              className="hidden md:flex items-center gap-2 text-[13px]"
              style={{ color: 'var(--hs-neutral-500)' }}
            >
              {breadcrumb.map((seg, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight style={{ width: 12, height: 12, color: 'var(--hs-neutral-400)' }} />}
                  <span
                    style={{
                      color: i === breadcrumb.length - 1
                        ? 'var(--hs-neutral-700)'
                        : 'var(--hs-neutral-400)',
                      fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                    }}
                  >
                    {seg.label}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: search, bell, avatar */}
          <div className="flex items-center gap-1.5">
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-[10px] transition-colors hover:bg-[var(--hs-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] focus-visible:ring-offset-2"
              style={{ color: 'var(--hs-neutral-700)' }}
              aria-label="Search"
            >
              <Search style={{ width: 14, height: 14 }} />
              <span>Search</span>
              <kbd
                className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-1"
                style={{ background: 'var(--hs-neutral-100)', color: 'var(--hs-neutral-500)' }}
              >
                ⌘K
              </kbd>
            </button>

            <button
              className="relative p-2 rounded-[10px] transition-colors hover:bg-[var(--hs-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] focus-visible:ring-offset-2"
              aria-label="Notifications"
            >
              <Bell style={{ width: 16, height: 16, color: 'var(--hs-neutral-600)' }} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--hs-accent)' }}
              />
            </button>

            <button
              className="ml-1 w-8 h-8 rounded-full text-white text-[12px] font-semibold flex items-center justify-center transition hover:ring-2 hover:ring-[var(--hs-neutral-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] focus-visible:ring-offset-2"
              style={{ background: 'linear-gradient(135deg, #404040, #171717)' }}
              aria-label="Account menu"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
