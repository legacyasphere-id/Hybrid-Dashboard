'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Building2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace-context'

const ALL_ITEMS = [
  { href: '/settings/profile', label: 'Profile', icon: User, minRole: 'member' },
  { href: '/settings/workspace', label: 'Workspace', icon: Building2, minRole: 'admin' },
  { href: '/settings/members', label: 'Members', icon: Users, minRole: 'admin' },
] as const

const ROLE_RANK: Record<string, number> = { owner: 3, admin: 2, member: 1 }

export function SettingsNav() {
  const pathname = usePathname()
  const { role } = useWorkspace()
  const userRank = ROLE_RANK[role] ?? 1

  const items = ALL_ITEMS.filter(
    (item) => userRank >= (ROLE_RANK[item.minRole] ?? 1),
  )

  return (
    <nav className="flex flex-row gap-1 lg:flex-col">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
