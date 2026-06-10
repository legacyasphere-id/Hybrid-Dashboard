import { Building2 } from 'lucide-react'

interface WorkspaceSwitcherProps {
  name: string
  plan: string
}

export function WorkspaceSwitcher({ name, plan }: WorkspaceSwitcherProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="text-xs capitalize text-muted-foreground">{plan} plan</p>
      </div>
    </div>
  )
}
