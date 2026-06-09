'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/layout/sidebar'
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher'
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

function SidebarContent({
  user,
  workspace,
  role,
  onNavigate,
}: Omit<AppShellProps, 'children'> & { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Workspace */}
      <div className="py-2">
        <WorkspaceSwitcher name={workspace.name} plan={workspace.plan} />
      </div>

      <Separator />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <Separator />

      {/* User */}
      <div className="py-2">
        <UserMenu email={user.email} fullName={user.fullName} role={role} />
      </div>
    </div>
  )
}

export function AppShell({ children, user, workspace, role }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar — fixed */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card">
        <SidebarContent user={user} workspace={workspace} role={role} />
      </aside>

      {/* Mobile sidebar — Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent
            user={user}
            workspace={workspace}
            role={role}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">{workspace.name}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
