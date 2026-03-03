import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function HeroRocket({ position = [1.4, 0.8, 3.2], scale = 2.8 }) {
  const rootRef = useRef()
  const flameRef = useRef()

  useFrame((state) => {
    if (!rootRef.current || !flameRef.current) return

    const t = state.clock.elapsedTime
    rootRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.2
    rootRef.current.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.08
    rootRef.current.rotation.z = Math.sin(t * 0.9) * 0.04

    const pulse = 0.85 + Math.sin(t * 10.0) * 0.2
    flameRef.current.scale.set(1, pulse, 1)
    flameRef.current.material.opacity = 0.55 + pulse * 0.35
  })

  return (
    <group ref={rootRef} position={position} scale={scale}>
      <mesh>
        <coneGeometry args={[0.22, 0.5, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.75} roughness={0.25} />
      </mesh>

      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.55, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.65} roughness={0.35} />
      </mesh>

      <mesh position={[0.11, -0.3, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.07, 0.2, 0.03]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[-0.11, -0.3, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.07, 0.2, 0.03]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.25} />
      </mesh>

      <mesh ref={flameRef} position={[0, -0.9, 0]}>
        <coneGeometry args={[0.1, 0.34, 10]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh position={[0, -1.08, 0]}>
        <cylinderGeometry args={[0.06, 0.11, 0.55, 10]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>

      <pointLight position={[0, -0.65, 0]} intensity={1.5} color="#06B6D4" distance={7} />

      <Html position={[0, 0.7, 0]} center distanceFactor={14}>
        <div className="rounded-full border border-star-gold/40 bg-space-black/80 px-2 py-1 text-[10px] font-mono tracking-wider text-star-gold">
          HERO ROCKET
        </div>
      </Html>
    </group>
  )
}
