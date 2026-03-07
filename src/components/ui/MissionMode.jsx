import { useMemo } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const objectives = [
  { key: 'aboutScanned', label: 'Scan About Planet' },
  { key: 'projectUnlocked', label: 'Unlock a Project Moon' },
  { key: 'contactDocked', label: 'Dock at Contact Station' },
]

export default function MissionMode() {
  const { mission, isExplored } = usePortfolioStore()

  const completed = useMemo(
    () => objectives.filter((item) => mission[item.key]).length,
    [mission],
  )

  const progress = Math.round((completed / objectives.length) * 100)
  const isComplete = completed === objectives.length

  if (!isExplored) return null

  return (
    <div className="absolute left-4 top-56 z-30 w-72 glass-panel px-4 py-3.5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-[0.24em] text-cyan-nebula">MISSION MODE</span>
          <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-slate">
            Explorer objectives
          </div>
        </div>
        <span className={`text-xs font-mono ${isComplete ? 'text-plasma-green' : 'text-muted-slate'}`}>
          {completed}/{objectives.length}
        </span>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-nebula via-cosmic-violet to-plasma-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2.5">
        {objectives.map((item) => (
          <div key={item.key} className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/5 px-2.5 py-2 text-xs">
            <span
              className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
                mission[item.key] ? 'bg-plasma-green shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'bg-white/30'
              }`}
            />
            <span className={`leading-relaxed ${mission[item.key] ? 'text-text-white' : 'text-muted-slate'}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-3 rounded border border-plasma-green/40 bg-plasma-green/10 px-2 py-1 text-center text-xs font-mono text-plasma-green">
          MISSION COMPLETE: VOID EXPLORER
        </div>
      )}
    </div>
  )
}
