import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function RocketScout({ radius = 5.5, speed = 0.35, scale = 2.4 }) {
  const rocketRef = useRef()
  const flameRef = useRef()

  useFrame((state) => {
    if (!rocketRef.current || !flameRef.current) return

    const t = state.clock.elapsedTime * speed
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius * 0.7 + 2.5
    const y = Math.sin(t * 1.4) * 1.2 + 0.8

    rocketRef.current.position.set(x, y, z)
    rocketRef.current.lookAt(x + Math.cos(t + 0.2), y, z + Math.sin(t + 0.2))

    const pulse = 0.75 + Math.sin(state.clock.elapsedTime * 14) * 0.25
    flameRef.current.scale.set(1, pulse, 1)
    flameRef.current.material.opacity = 0.5 + pulse * 0.4
  })

  return (
    <group ref={rocketRef} scale={scale}>
      <mesh>
        <coneGeometry args={[0.18, 0.45, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.75} roughness={0.28} />
      </mesh>

      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.45, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.65} roughness={0.35} />
      </mesh>

      <mesh position={[0.08, -0.26, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.06, 0.18, 0.02]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.08, -0.26, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.06, 0.18, 0.02]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.2} />
      </mesh>

      <mesh ref={flameRef} position={[0, -0.68, 0]}>
        <coneGeometry args={[0.08, 0.28, 10]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, -0.86, 0]}>
        <cylinderGeometry args={[0.045, 0.09, 0.48, 10]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight position={[0, -0.55, 0]} intensity={1.25} color="#06B6D4" distance={6} />

      <Html position={[0, 0.5, 0]} center distanceFactor={12}>
        <div className="rounded-full border border-cyan-nebula/30 bg-space-black/70 px-2 py-1 text-[10px] font-mono tracking-wider text-cyan-nebula">
          ROCKET SCOUT
        </div>
      </Html>
    </group>
  )
}
