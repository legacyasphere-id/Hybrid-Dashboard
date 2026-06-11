'use client'

import { ChevronDown } from 'lucide-react'

interface WorkspaceSwitcherProps {
  name: string
  plan: string
}

export function WorkspaceSwitcher({ name, plan }: WorkspaceSwitcherProps) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <button
      aria-label="Switch workspace"
      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] hover:bg-white/5"
    >
      <div
        className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}
      >
        {initial}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-[13px] font-semibold leading-tight truncate text-white">{name}</div>
        <div className="text-[11px] leading-tight capitalize" style={{ color: '#737373' }}>
          Studio · {plan}
        </div>
      </div>
      <ChevronDown style={{ width: 14, height: 14, color: '#737373' }} />
    </button>
  )
}
