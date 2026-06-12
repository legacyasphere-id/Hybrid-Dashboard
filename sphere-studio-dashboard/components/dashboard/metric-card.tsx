import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: number | string
  change?: number       // e.g. 12 means +12%
  sparkline?: number[]  // array of values for the SVG sparkline
  href?: string
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 80
  const H = 28
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 4) - 2
    return `${x},${y}`
  })
  const pathD = pts.map((p, i) => (i === 0 ? `M${p}` : `L${p}`)).join(' ')
  const areaD =
    `M${pts[0]} ` +
    pts
      .slice(1)
      .map((p) => `L${p}`)
      .join(' ') +
    ` L${W},${H} L0,${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sg)" />
      <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function MetricCard({ label, value, change, sparkline }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div
      className="bg-white rounded-[14px] p-5 flex flex-col gap-3 transition-shadow group"
      style={{
        border: '1px solid var(--hs-neutral-200)',
        boxShadow: 'var(--hs-shadow-card)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--hs-shadow-hover)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--hs-shadow-card)'
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-light mb-1" style={{ color: 'var(--hs-neutral-500)' }}>
            {label}
          </p>
          <p className="text-[28px] font-semibold leading-none tabular-nums" style={{ color: 'var(--hs-neutral-900)' }}>
            {value}
          </p>
        </div>
        {sparkline && <Sparkline data={sparkline} />}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              color: isPositive ? '#059669' : '#e11d48',
            }}
          >
            {isPositive ? (
              <TrendingUp style={{ width: 10, height: 10 }} />
            ) : (
              <TrendingDown style={{ width: 10, height: 10 }} />
            )}
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-[11px] font-light" style={{ color: 'var(--hs-neutral-400)' }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  )
}
