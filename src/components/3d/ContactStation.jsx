import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { Send, Github, Linkedin, Mail, X, Radio } from 'lucide-react'

export default function ContactStation({ position, scale }) {
  const stationRef = useRef()
  const lightsRef = useRef([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const { markMissionStep } = usePortfolioStore()

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }

    lightsRef.current.forEach((light, i) => {
      if (light) {
        const phase = state.clock.elapsedTime * 2 + i
        light.material.opacity = 0.3 + Math.sin(phase) * 0.3
      }
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const toggleForm = () => {
    setShowForm((prev) => {
      const next = !prev
      if (next) markMissionStep('contactDocked')
      return next
    })
  }

  return (
    <group position={position} scale={scale}>
      <group ref={stationRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 1, 1.5, 32]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh position={[0, 1, 0]}>
          <torusGeometry args={[0.9, 0.15, 16, 32]} />
          <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.5} />
        </mesh>

        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[1.2, 0.8, 0.3, 32]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>

        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 0.9
          const z = Math.sin(angle) * 0.9

          return (
            <group key={i} position={[x, 0.5, z]}>
              <mesh ref={(el) => (lightsRef.current[i] = el)}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
              </mesh>
            </group>
          )
        })}

        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>

        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>

        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
      </group>

      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <span className="text-plasma-green text-sm font-mono tracking-wider">
            [ CONTACT ]
          </span>
        </div>
      </Html>

      <Html position={[0, 1.8, 1.2]} center>
        <button
          onClick={toggleForm}
          className="glass-panel rounded-full px-4 py-2 text-sm font-mono tracking-[0.08em] text-text-white transition-colors hover:bg-white/10"
        >
          {showForm ? 'Close Transmission' : 'Open Transmission'}
        </button>
      </Html>

      {showForm && (
        <Html position={[4.25, 0.2, 0]}>
          <div className="glass-panel w-[340px] overflow-hidden">
            <div className="border-b border-white/10 bg-gradient-to-r from-cosmic-violet/20 to-cyan-nebula/10 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-nebula">
                    <Radio size={12} />
                    Contact uplink
                  </div>
                  <h3 className="text-xl font-semibold text-gradient">Transmission Deck</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-slate">
                    Send a direct message or jump to social channels.
                  </p>
                </div>

                <button
                  onClick={toggleForm}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-slate transition-colors hover:border-cosmic-violet/40 hover:text-text-white"
                  title="Close transmission panel"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!sent ? (
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-slate">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-space-black/45 px-4 py-2.5 text-sm text-text-white placeholder-muted-slate focus:border-cosmic-violet focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-slate">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-space-black/45 px-4 py-2.5 text-sm text-text-white placeholder-muted-slate focus:border-cyan-nebula focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-slate">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell me about the project, role, or idea you want to build."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full resize-none rounded-xl border border-white/10 bg-space-black/45 px-4 py-3 text-sm text-text-white placeholder-muted-slate focus:border-plasma-green focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cosmic-violet/60 bg-gradient-to-r from-cosmic-violet/30 to-cyan-nebula/20 px-4 py-3 text-sm font-medium text-text-white transition-colors hover:from-cosmic-violet/45 hover:to-cyan-nebula/30"
                  >
                    <Send size={16} />
                    Send Transmission
                  </button>
                </form>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-slate">
                    Quick channels
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={portfolioData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-white transition-colors hover:border-cyan-nebula/40 hover:bg-white/10"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                    <a
                      href={portfolioData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-white transition-colors hover:border-cyan-nebula/40 hover:bg-white/10"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </a>
                    <a
                      href={`mailto:${portfolioData.email}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-white transition-colors hover:border-cyan-nebula/40 hover:bg-white/10"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="rounded-2xl border border-plasma-green/30 bg-plasma-green/10 px-5 py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-plasma-green/20">
                    <span className="text-2xl">[ OK ]</span>
                  </div>
                  <p className="text-lg font-semibold text-plasma-green">Signal Sent</p>
                  <p className="mt-2 text-sm text-muted-slate">
                    Transmission queued. I will get back to you soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
