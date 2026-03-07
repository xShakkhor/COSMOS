import { useMemo, useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Radar } from 'lucide-react'

const sectionPositions = {
  about: { x: -30, y: 0, label: 'PLANET', color: '#7C3AED' },
  skills: { x: 30, y: 0, label: 'NEBULA', color: '#06B6D4' },
  projects: { x: 0, y: 0, label: 'SYSTEM', color: '#F59E0B' },
  experience: { x: 0, y: -30, label: 'BELT', color: '#10B981' },
  contact: { x: 0, y: 30, label: 'STATION', color: '#EC4899' }
}

export default function SpaceRadar() {
  const { currentSection, setCurrentSection, isExplored } = usePortfolioStore()
  const [isOpen, setIsOpen] = useState(true)
  const radarPosition = useMemo(() => {
    const section = sectionPositions[currentSection]
    if (!section) {
      return { x: 50, y: 50 }
    }

    return {
      x: 50 + (section.x / 60) * 50,
      y: 50 + (section.y / 60) * 50,
    }
  }, [currentSection])

  if (!isExplored) return null

  return (
    <div className="absolute bottom-20 right-4 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-panel w-36 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.18em] text-muted-slate">
                <Radar size={13} className="text-cyan-nebula" />
                SPACE RADAR
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-slate transition-colors hover:border-cyan-nebula/40 hover:text-text-white"
                title="Collapse radar"
              >
                <Minus size={12} />
              </button>
            </div>
            
            <div className="relative w-32 h-32 rounded-full border border-cosmic-violet/30 bg-space-black/50 overflow-hidden">
              {/* Radar rings */}
              <div className="absolute inset-2 rounded-full border border-cyan-nebula/20"></div>
              <div className="absolute inset-6 rounded-full border border-cyan-nebula/10"></div>
              <div className="absolute inset-10 rounded-full border border-cyan-nebula/5"></div>
              
              {/* Cross lines */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-nebula/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-nebula/20"></div>
              
              {/* Section dots */}
              {Object.entries(sectionPositions).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setCurrentSection(key)}
                  className="absolute w-2.5 h-2.5 rounded-full transition-all hover:scale-150"
                  style={{
                    left: `${50 + (section.x / 60) * 50}%`,
                    top: `${50 + (section.y / 60) * 50}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: currentSection === key ? section.color : `${section.color}50`,
                    boxShadow: currentSection === key ? `0 0 10px ${section.color}` : 'none'
                  }}
                  title={section.label}
                />
              ))}
              
              {/* Current position indicator */}
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-plasma-green"
                animate={{
                  left: `${radarPosition.x}%`,
                  top: `${radarPosition.y}%`
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-plasma-green"
                  animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Radar sweep */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(6, 182, 212, 0.1) 30deg, transparent 60deg)'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-xs font-mono" style={{ color: sectionPositions[currentSection]?.color }}>
                {sectionPositions[currentSection]?.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-panel flex h-10 w-10 items-center justify-center"
          title="Open radar"
        >
          <Radar size={16} className="text-cyan-nebula" />
        </button>
      )}
    </div>
  )
}
