import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ShootingStar({ startPosition, delay, speed }) {
  const meshRef = useRef()
  const trailRef = useRef()
  const startTime = useRef(null)
  
  const geometry = useMemo(() => new THREE.ConeGeometry(0.02, 0.15, 8), [])
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.9
  }), [])
  
  const trailMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#06B6D4',
    transparent: true,
    opacity: 0.3
  }), [])

  useFrame((state) => {
    if (!meshRef.current) return
    
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime + delay
    }
    
    const elapsed = state.clock.elapsedTime - startTime.current
    if (elapsed < 0) return
    
    const progress = (elapsed * speed) % 2
    
    if (progress < 1) {
      meshRef.current.visible = true
      meshRef.current.position.x = startPosition[0] - progress * 40
      meshRef.current.position.y = startPosition[1] + progress * 10
      meshRef.current.position.z = startPosition[2] - progress * 20
      
      meshRef.current.rotation.z = Math.PI / 4
      meshRef.current.rotation.y = Math.PI / 6
      
      if (trailRef.current) {
        trailRef.current.visible = true
        trailRef.current.position.copy(meshRef.current.position)
        trailRef.current.position.x += 0.3
        trailRef.current.position.y -= 0.3
      }
    } else {
      meshRef.current.visible = false
      if (trailRef.current) trailRef.current.visible = false
      startTime.current = null
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <mesh ref={trailRef} geometry={geometry} material={trailMaterial} scale={[1, 3, 1]} />
    </group>
  )
}

export default function CometEffects({ count = 8 }) {
  const comets = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      startPosition: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 20
      ],
      delay: Math.random() * 15,
      speed: 0.3 + Math.random() * 0.4
    }))
  }, [count])

  return (
    <group>
      {comets.map((comet, i) => (
        <ShootingStar
          key={i}
          startPosition={comet.startPosition}
          delay={comet.delay}
          speed={comet.speed}
        />
      ))}
    </group>
  )
}
