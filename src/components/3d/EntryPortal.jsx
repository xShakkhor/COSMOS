import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { portfolioData } from '../../data/content'
import * as THREE from 'three'

export default function EntryPortal({ onComplete }) {
  const points = useRef()
  const groupRef = useRef()
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [typedText, setTypedText] = useState('')
  const { setIsExplored } = usePortfolioStore()
  
  const particleCount = 5000
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.1
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)
      
      velocities[i3] = (Math.random() - 0.5) * 2
      velocities[i3 + 1] = (Math.random() - 0.5) * 2
      velocities[i3 + 2] = (Math.random() - 0.5) * 2
    }
    
    return { positions, velocities }
  }, [])
  
  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.to(points.current.material, {
      opacity: 1,
      duration: 0.5
    })
    
    tl.to(points.current.scale, {
      x: 50,
      y: 50,
      z: 50,
      duration: 2,
      ease: 'expo.out'
    }, 0.5)
    
    const positions = points.current.geometry.attributes.position.array
    const velocities = particles.velocities
    
    tl.to(positions, {
      duration: 2,
      onUpdate: function() {
        const progress = this.progress()
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          positions[i3] += velocities[i3] * progress * 0.1
          positions[i3 + 1] += velocities[i3 + 1] * progress * 0.1
          positions[i3 + 2] += velocities[i3 + 2] * progress * 0.1
        }
        points.current.geometry.attributes.position.needsUpdate = true
      },
      ease: 'expo.out'
    }, 0.5)
    
    tl.call(() => setShowText(true), null, 2)
    
    tl.to({}, {
      duration: 2,
        onComplete: () => {
        let i = 0
        const typeInterval = setInterval(() => {
          if (i <= portfolioData.shortName.length) {
            setTypedText(portfolioData.shortName.slice(0, i))
            i++
          } else {
            clearInterval(typeInterval)
            setTimeout(() => setShowButton(true), 500)
          }
        }, 100)
      }
    }, 2.5)
    
  }, [])
  
  const handleEnter = () => {
    const tl = gsap.timeline()
    
    tl.to(groupRef.current.scale, {
      x: 100,
      y: 100,
      z: 100,
      duration: 1,
      ease: 'expo.in'
    })
    
    tl.to(groupRef.current, {
      opacity: 0,
      duration: 0.5
    }, 0.8)
    
    tl.call(() => {
      setIsExplored(true)
      onComplete?.()
    }, null, 1.2)
  }

  return (
    <group ref={groupRef}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#7C3AED"
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {showText && (
        <Html center>
          <div className="text-center pointer-events-none">
            <h1 
              className="text-6xl font-bold text-gradient mb-4"
              style={{ 
                fontFamily: 'Space Grotesk',
                textShadow: '0 0 30px rgba(124, 58, 237, 0.8)'
              }}
            >
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
            <p 
              className="text-xl text-muted-slate mb-8"
              style={{ fontFamily: 'Geist Mono' }}
            >
              {portfolioData.subtitle}
            </p>
            
            {showButton && (
              <motion.button
                onClick={handleEnter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto mt-4 px-10 py-4 bg-gradient-to-r from-cosmic-violet to-cyan-nebula border-2 border-white/30 rounded-full text-white font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.6),0_0_60px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8),0_0_80px_rgba(6,182,212,0.6)] transition-all duration-300"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                ENTER THE VOID
                <span className="ml-2">🚀</span>
              </motion.button>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
