import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../../store/usePortfolioStore'

function makeNodes(project) {
  const tech = project.tech || []
  const primary = tech[0] || 'Frontend'
  const backend = tech[1] || 'API'
  const infra = tech[2] || 'Deploy'

  return [
    { id: 'client', label: primary, x: 14, y: 20 },
    { id: 'gateway', label: 'Gateway', x: 42, y: 46 },
    { id: 'service', label: backend, x: 66, y: 28 },
    { id: 'data', label: 'Data Layer', x: 82, y: 62 },
    { id: 'ops', label: infra, x: 34, y: 78 },
  ]
}

const links = [
  ['client', 'gateway'],
  ['gateway', 'service'],
  ['service', 'data'],
  ['gateway', 'ops'],
]

export default function ProjectDeepZoomScene() {
  const { deepZoomProject, closeDeepZoomProject } = usePortfolioStore()

  const nodes = useMemo(() => {
    if (!deepZoomProject) return []
    return makeNodes(deepZoomProject)
  }, [deepZoomProject])

  useEffect(() => {
    if (!deepZoomProject) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDeepZoomProject()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeDeepZoomProject, deepZoomProject])

  return (
    <AnimatePresence>
      {deepZoomProject && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-space-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative h-[min(88vh,760px)] w-[min(95vw,1200px)] overflow-hidden rounded-2xl border border-cyan-nebula/40 bg-[radial-gradient(circle_at_25%_15%,rgba(6,182,212,0.12),rgba(3,0,20,0.94)_60%)]"
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 10 }}
            transition={{ duration: 0.24 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div>
                <div className="text-[10px] font-mono tracking-[0.28em] text-cyan-nebula">PROJECT DEEP ZOOM</div>
                <div className="text-lg font-semibold text-text-white">{deepZoomProject.title}</div>
              </div>
              <button
                onClick={closeDeepZoomProject}
                className="rounded-lg border border-white/20 px-3 py-1 text-xs font-mono text-muted-slate hover:text-text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="relative z-10 grid h-[calc(100%-64px)] grid-cols-1 gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-white/10 bg-space-black/45 p-4">
                <div className="mb-3 text-xs font-mono tracking-wider text-muted-slate">SYSTEM ARCHITECTURE MAP</div>

                <div className="relative h-[420px] overflow-hidden rounded-lg border border-white/10 bg-space-black/60">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {links.map(([from, to]) => {
                      const fromNode = nodes.find((node) => node.id === from)
                      const toNode = nodes.find((node) => node.id === to)
                      if (!fromNode || !toNode) return null
                      return (
                        <line
                          key={`${from}-${to}`}
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={deepZoomProject.color}
                          strokeOpacity="0.65"
                          strokeWidth="0.6"
                        />
                      )
                    })}
                  </svg>

                  {nodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-xs font-mono"
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        borderColor: `${deepZoomProject.color}88`,
                        backgroundColor: `${deepZoomProject.color}20`,
                        color: '#F8FAFC',
                        boxShadow: `0 0 16px ${deepZoomProject.color}55`,
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.08 * index }}
                    >
                      {node.label}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-slate">
                  <span className="font-mono text-cyan-nebula">FLOW:</span> Client request enters gateway, routes to service layer,
                  persists in data layer, and deploy/ops pipeline tracks runtime health.
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-white/10 bg-space-black/45 p-4">
                  <div className="mb-2 text-xs font-mono tracking-wider text-muted-slate">MISSION SNAPSHOT</div>
                  <p className="text-sm text-text-white/90">{deepZoomProject.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {deepZoomProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border px-2 py-1 text-[10px] font-mono"
                        style={{
                          borderColor: `${deepZoomProject.color}88`,
                          color: deepZoomProject.color,
                          backgroundColor: `${deepZoomProject.color}1A`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-space-black/45 p-4">
                  <div className="mb-2 text-xs font-mono tracking-wider text-muted-slate">DELIVERY TIMELINE</div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-nebula" />
                      <div>
                        <div className="text-text-white">Discovery & UX mapping</div>
                        <div className="text-muted-slate">Defined architecture, edge cases, and interaction model.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-plasma-green" />
                      <div>
                        <div className="text-text-white">Core implementation</div>
                        <div className="text-muted-slate">Built feature modules and integrated runtime states.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-star-gold" />
                      <div>
                        <div className="text-text-white">Optimization & launch</div>
                        <div className="text-muted-slate">Applied performance tuning and production deployment pass.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-space-black/45 p-4">
                  <div className="mb-2 text-xs font-mono tracking-wider text-muted-slate">EXTERNAL LINKS</div>
                  <div className="flex gap-2">
                    <a
                      href={deepZoomProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-plasma-green/40 bg-plasma-green/15 px-3 py-2 text-xs font-mono text-plasma-green hover:bg-plasma-green/25"
                    >
                      OPEN LIVE
                    </a>
                    <a
                      href={deepZoomProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-cosmic-violet/40 bg-cosmic-violet/15 px-3 py-2 text-xs font-mono text-cosmic-violet hover:bg-cosmic-violet/25"
                    >
                      OPEN SOURCE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
