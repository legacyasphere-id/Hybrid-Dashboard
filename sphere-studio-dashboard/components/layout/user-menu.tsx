'use client'

import { useTransition } from 'react'
import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth/actions'

interface UserMenuProps {
  email: string
  fullName: string | null
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

export function UserMenu({ email, fullName, role }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()
  const initials = getInitials(email, fullName)

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-[10px] text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <div
            className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #404040, #171717)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{fullName ?? email}</p>
            <p className="truncate text-[11px] capitalize" style={{ color: '#737373' }}>{role}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{fullName ?? 'User'}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isPending}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
