import { toneStroke, scoreTone } from "@/lib/score"
import type { ResumeVersion } from "@/lib/types"

// Lightweight, dependency-free line chart that plots each version's score
// over time. Pure SVG so it renders on the server and matches the app's
// hand-built gauge aesthetic.
export function ScoreProgression({ versions }: { versions: ResumeVersion[] }) {
  const width = 640
  const height = 200
  const padX = 32
  const padY = 28
  const min = 0
  const max = 100

  const points = versions.map((v, i) => {
    const x =
      versions.length === 1
        ? width / 2
        : padX + (i * (width - padX * 2)) / (versions.length - 1)
    const y = padY + (1 - (v.score - min) / (max - min)) * (height - padY * 2)
    return { x, y, version: v }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[420px]"
        role="img"
        aria-label="Resume score progression over time"
      >
        {/* horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padY + (1 - tick / 100) * (height - padY * 2)
          return (
            <g key={tick}>
              <line
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="2 4"
              />
              <text
                x={padX - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize="10"
              >
                {tick}
              </text>
            </g>
          )
        })}

        <defs>
          <linearGradient id="score-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#score-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p) => (
          <g key={p.version.id}>
            <circle cx={p.x} cy={p.y} r={5} fill="var(--background)" stroke={toneStroke[scoreTone(p.version.score)]} strokeWidth={2.5} />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="fill-foreground"
              fontSize="11"
              fontWeight="600"
            >
              {p.version.score}
            </text>
            <text
              x={p.x}
              y={height - padY + 16}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="10"
            >
              {p.version.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
