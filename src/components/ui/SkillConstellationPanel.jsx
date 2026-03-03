import { useMemo } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { portfolioData } from '../../data/content'

function projectMatchesCategory(project, category) {
  if (!category) return false
  const group = portfolioData.skills.find((item) => item.category === category)
  if (!group) return false
  const tech = project.tech.map((item) => item.toLowerCase())
  return group.skills.some((skill) => tech.includes(skill.toLowerCase()))
}

export default function SkillConstellationPanel() {
  const { isExplored, selectedSkillCategory, setSelectedSkillCategory, setCurrentSection } = usePortfolioStore()

  const linkedProjects = useMemo(() => {
    if (!selectedSkillCategory) return []
    return portfolioData.projects.filter((project) => projectMatchesCategory(project, selectedSkillCategory))
  }, [selectedSkillCategory])

  if (!isExplored) return null

  return (
    <div className="absolute right-4 top-24 z-30 w-[320px] glass-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider text-cyan-nebula">SKILL CONSTELLATION</span>
        <button
          onClick={() => setSelectedSkillCategory(null)}
          className="text-[10px] font-mono text-muted-slate hover:text-text-white"
        >
          CLEAR
        </button>
      </div>

      <div className="mb-3 rounded border border-white/10 bg-white/5 p-2">
        <div className="mb-2 text-[10px] font-mono tracking-wider text-muted-slate">CLUSTER MAP</div>
        <div className="relative h-28">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 110" preserveAspectRatio="none">
            {portfolioData.skills.map((skill, index) => {
              const x = 40 + ((index * 53) % 220)
              const y = 20 + ((index * 29) % 70)
              return (
                <line
                  key={`line-${skill.category}`}
                  x1={140}
                  y1={55}
                  x2={x}
                  y2={y}
                  stroke={skill.color}
                  strokeOpacity={selectedSkillCategory === skill.category ? 0.85 : 0.25}
                  strokeWidth={selectedSkillCategory === skill.category ? 2.5 : 1}
                />
              )
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-nebula/40 bg-space-black px-2 py-1 text-[10px] font-mono text-cyan-nebula">
            PROJECT CORE
          </div>

          {portfolioData.skills.map((skill, index) => {
            const x = 8 + ((index * 18) % 74)
            const y = 10 + ((index * 23) % 70)
            const active = selectedSkillCategory === skill.category
            return (
              <button
                key={skill.category}
                onClick={() => setSelectedSkillCategory(active ? null : skill.category)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-mono transition-all"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  borderColor: `${skill.color}80`,
                  color: active ? '#F8FAFC' : skill.color,
                  background: active ? `${skill.color}55` : 'rgba(3,0,20,0.65)',
                  boxShadow: active ? `0 0 14px ${skill.color}` : 'none',
                }}
              >
                {skill.category}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded border border-white/10 bg-white/5 p-2">
        <div className="mb-2 text-[10px] font-mono tracking-wider text-muted-slate">LINKED PROJECTS</div>

        {!selectedSkillCategory && (
          <div className="text-xs text-muted-slate">Select a skill cluster to reveal connected projects.</div>
        )}

        {selectedSkillCategory && linkedProjects.length === 0 && (
          <div className="text-xs text-muted-slate">No direct tech match found for this cluster yet.</div>
        )}

        {selectedSkillCategory && linkedProjects.length > 0 && (
          <div className="space-y-2">
            {linkedProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setCurrentSection('projects')}
                className="w-full rounded border border-white/10 bg-space-black/70 px-2 py-2 text-left hover:border-cyan-nebula/60"
              >
                <div className="text-xs font-semibold text-text-white">{project.title}</div>
                <div className="mt-1 text-[10px] text-muted-slate">{project.tech.join(' • ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
