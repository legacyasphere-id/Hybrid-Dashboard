'use client'

import { useState } from 'react'

type Range = '7D' | '30D' | '90D'

// Generate pseudo-stable demo data from a seed
function genData(days: number): number[] {
  const data: number[] = []
  let v = 18000
  for (let i = 0; i < days; i++) {
    v += (Math.sin(i * 0.4) * 1200) + (Math.random() * 800 - 400)
    data.push(Math.max(8000, Math.round(v)))
  }
  return data
}

const DATASETS: Record<Range, number[]> = {
  '7D': genData(7),
  '30D': genData(30),
  '90D': genData(90),
}

const W = 600
const H = 200
const PAD_LEFT = 42
const PAD_RIGHT = 8
const PAD_TOP = 8
const PAD_BOTTOM = 2
const CW = W - PAD_LEFT - PAD_RIGHT
const CH = H - PAD_TOP - PAD_BOTTOM

function buildPath(data: number[]) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: PAD_LEFT + (i / (data.length - 1)) * CW,
    y: PAD_TOP + CH - ((v - min) / range) * CH,
  }))
  const line = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
  const area =
    `M${pts[0]!.x},${pts[0]!.y} ` +
    pts
      .slice(1)
      .map((p) => `L${p.x},${p.y}`)
      .join(' ') +
    ` L${pts[pts.length - 1]!.x},${PAD_TOP + CH} L${pts[0]!.x},${PAD_TOP + CH} Z`
  return { line, area, pts, min, max }
}

function yLabels(min: number, max: number) {
  const step = (max - min) / 4
  return [0, 1, 2, 3, 4].map((i) => ({
    value: Math.round(min + step * (4 - i)),
    y: PAD_TOP + (i / 4) * CH,
  }))
}

function fmt(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`
  return `$${v}`
}

export function RevenueChart() {
  const [range, setRange] = useState<Range>('30D')
  const data = DATASETS[range]!
  const { line, area, pts, min, max } = buildPath(data)
  const labels = yLabels(min, max)
  const total = data.reduce((a, b) => a + b, 0)
  const projected = Math.round((total / data.length) * 30)

  // X-axis labels — show ~6 evenly spaced
  const xCount = Math.min(6, data.length)
  const xLabels = Array.from({ length: xCount }, (_, i) => {
    const idx = Math.round((i / (xCount - 1)) * (data.length - 1))
    return { idx, x: pts[idx]!.x }
  })

  return (
    <section
      className="bg-white rounded-[14px] p-5 sm:p-6"
      style={{ border: '1px solid var(--hs-neutral-200)', boxShadow: 'var(--hs-shadow-card)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--hs-neutral-900)' }}>
            Revenue
          </h2>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            Last {range === '7D' ? '7' : range === '30D' ? '30' : '90'} days
          </p>
        </div>
        <div className="flex items-center gap-1 text-[12px]">
          {(['7D', '30D', '90D'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-2.5 py-1 rounded-[6px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)]"
              style={
                range === r
                  ? { background: 'var(--hs-accent)', color: '#fff', fontWeight: 500 }
                  : { color: 'var(--hs-neutral-500)' }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5 mt-3">
        <div>
          <span className="text-[24px] font-semibold tracking-tight tabular-nums" style={{ color: 'var(--hs-neutral-900)' }}>
            {fmt(projected)}
          </span>
          <span className="text-[12px] ml-1.5 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            Projected month-end
          </span>
        </div>
        <div>
          <span className="text-[12px] font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            MTD actual
          </span>
          <span className="text-[12px] font-medium ml-1 tabular-nums" style={{ color: 'var(--hs-neutral-700)' }}>
            {fmt(Math.round(total * 0.78))}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full" style={{ aspectRatio: '600 / 200' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="block w-full h-full" aria-label="Revenue trend">
          <defs>
            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {labels.map((l) => (
            <line
              key={l.y}
              x1={PAD_LEFT}
              y1={l.y}
              x2={W - PAD_RIGHT}
              y2={l.y}
              stroke="#f4f4f5"
              strokeWidth="1"
            />
          ))}
          {/* Y labels */}
          {labels.map((l) => (
            <text
              key={l.y}
              x={PAD_LEFT - 6}
              y={l.y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#a1a1aa"
            >
              {fmt(l.value)}
            </text>
          ))}
          {/* Area fill */}
          <path d={area} fill="url(#rev-grad)" />
          {/* Line */}
          <path d={line} fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>

      {/* X-axis labels */}
      <div
        className="flex justify-between text-[10px] tabular-nums mt-2 font-light"
        style={{ color: 'var(--hs-neutral-400)', paddingLeft: `${PAD_LEFT}px`, paddingRight: `${PAD_RIGHT}px` }}
      >
        {xLabels.map(({ idx }) => (
          <span key={idx}>
            {range === '7D'
              ? `D-${data.length - idx}`
              : range === '30D'
              ? `D-${data.length - idx}`
              : `W-${Math.ceil((data.length - idx) / 7)}`}
          </span>
        ))}
      </div>
    </section>
  )
}
