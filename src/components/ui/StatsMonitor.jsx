import { useState, useEffect, useRef } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, HardDrive } from 'lucide-react'

function StatsMonitor() {
  const { isExplored } = usePortfolioStore()
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    if (!isExplored) return

    let animationId
    
    const updateStats = () => {
      frameCount.current++
      const now = performance.now()
      
      if (now - lastTime.current >= 1000) {
        setFps(Math.round(frameCount.current * 1000 / (now - lastTime.current)))
        frameCount.current = 0
        lastTime.current = now
        
        if (performance.memory) {
          setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576))
        }
      }
      
      animationId = requestAnimationFrame(updateStats)
    }
    
    animationId = requestAnimationFrame(updateStats)
    return () => cancelAnimationFrame(animationId)
  }, [isExplored])

  if (!isExplored) return null

  return (
    <div className="absolute top-16 left-4 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-3 min-w-[140px]"
          >
            <div className="text-xs text-muted-slate font-mono mb-2 flex items-center gap-1">
              <Activity size={12} />
              PERFORMANCE
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${fps >= 50 ? 'bg-plasma-green' : fps >= 30 ? 'bg-star-gold' : 'bg-red-500'}`}></span>
                  <span className="text-xs text-muted-slate">FPS</span>
                </div>
                <span className={`text-sm font-mono ${fps >= 50 ? 'text-plasma-green' : fps >= 30 ? 'text-star-gold' : 'text-red-500'}`}>
                  {fps}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cpu size={12} className="text-muted-slate" />
                  <span className="text-xs text-muted-slate">Render</span>
                </div>
                <span className="text-xs font-mono text-cyan-nebula">
                  Three.js
                </span>
              </div>
              
              {memory > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={12} className="text-muted-slate" />
                    <span className="text-xs text-muted-slate">Memory</span>
                  </div>
                  <span className="text-xs font-mono text-cosmic-violet">
                    {memory} MB
                  </span>
                </div>
              )}
            </div>
            
            {/* FPS Graph */}
            <div className="mt-3 h-8 flex items-end gap-px">
              {Array.from({ length: 20 }).map((_, i) => {
                const height = Math.min(100, fps * 1.5 + Math.random() * 20)
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${height}%`,
                      backgroundColor: height >= 50 ? '#10B981' : height >= 30 ? '#F59E0B' : '#EF4444',
                      opacity: 0.5 + Math.random() * 0.5
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel w-8 h-8 flex items-center justify-center"
      >
        <Activity size={16} className={isOpen ? 'text-plasma-green' : 'text-muted-slate'} />
      </button>
    </div>
  )
}

export default StatsMonitor
