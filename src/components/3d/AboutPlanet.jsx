import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += noise(p) * amplitude;
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.08;
    vec2 centeredUv = uv - 0.5;
    float swirl = sin(atan(centeredUv.y, centeredUv.x) * 3.0 + length(centeredUv) * 8.0 - time * 2.0);
    float terrain = fbm(uv * 4.0 + vec2(time * 0.6, -time * 0.3));
    float bands = smoothstep(-0.45, 0.75, swirl * 0.35 + terrain * 0.95);
    
    vec3 color1 = vec3(0.05, 0.03, 0.14);
    vec3 color2 = vec3(0.17, 0.08, 0.32);
    vec3 color3 = vec3(0.44, 0.23, 0.85);
    vec3 color4 = vec3(0.08, 0.63, 0.78);
    
    vec3 color = mix(color1, color2, smoothstep(0.0, 0.28, bands));
    color = mix(color, color3, smoothstep(0.28, 0.72, bands));
    color = mix(color, color4, smoothstep(0.72, 1.0, bands));
    color += palette(terrain + time * 0.15) * 0.06;
    
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    color += fresnel * vec3(0.486, 0.227, 0.929) * 0.35;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function AboutPlanet({ position, scale }) {
  const meshRef = useRef()
  const atmosphereRef = useRef()
  const [showBio, setShowBio] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { markMissionStep } = usePortfolioStore()
  
  const uniforms = {
    uTime: { value: 0 }
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (hovered ? 0.1 : 0.3)
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.1
    }
  })

  return (
    <group position={position} scale={scale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => {
            setShowBio((prev) => {
              const next = !prev
              if (next) markMissionStep('aboutScanned')
              return next
            })
          }}
        >
          <sphereGeometry args={[1.5, 64, 64]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
        
        <mesh ref={atmosphereRef}>
          <ringGeometry args={[1.6, 2.2, 64]} />
          <meshBasicMaterial
            color="#7C3AED"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
      
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {showBio && (
        <Html distanceFactor={10} position={[3, 0, 0]}>
          <div className="glass-panel p-6 w-80 animate-float">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-cosmic-violet overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-cosmic-violet to-cyan-nebula flex items-center justify-center text-3xl">
                👨‍💻
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gradient mb-2">
              {portfolioData.name}
            </h2>
            
            <p className="text-muted-slate text-sm mb-4 text-center leading-relaxed">
              {portfolioData.bio}
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-muted-slate text-xs">📍</span>
              <span className="text-muted-slate text-xs">{portfolioData.location}</span>
            </div>
            
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-plasma-green/20 text-plasma-green text-xs rounded-full border border-plasma-green/30">
                {portfolioData.availability}
              </span>
            </div>
            
            <button
              className="w-full mt-4 px-4 py-2 bg-cosmic-violet/20 border border-cosmic-violet rounded-lg text-text-white text-sm hover:bg-cosmic-violet/40 transition-colors"
              onClick={() => window.open(portfolioData.github, '_blank')}
            >
              Download CV
            </button>
          </div>
        </Html>
      )}
      
      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <span className="text-cosmic-violet text-sm font-mono tracking-wider">
            [ ABOUT ]
          </span>
        </div>
      </Html>
    </group>
  )
}
