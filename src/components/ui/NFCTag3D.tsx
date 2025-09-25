import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CardMeshProps {
  mouseX: number
  mouseY: number
}

function CardMesh({ mouseX, mouseY }: CardMeshProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const elapsed = clock.elapsedTime
    groupRef.current.position.y = Math.sin(elapsed * 0.6) * 0.08

    const targetRotX = mouseY * 0.35
    const targetRotY = mouseX * 0.35
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05
  })

  return (
    <group ref={groupRef}>
      {/* Card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.0, 0.06]} />
        <meshStandardMaterial
          color="#140830"
          metalness={0.92}
          roughness={0.08}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Card edge highlight — top */}
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[3.2, 0.01, 0.06]} />
        <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.6} metalness={1} roughness={0} />
      </mesh>

      {/* Card edge highlight — bottom */}
      <mesh position={[0, -1.01, 0]}>
        <boxGeometry args={[3.2, 0.01, 0.06]} />
        <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.3} metalness={1} roughness={0} />
      </mesh>

      {/* Chip body */}
      <mesh position={[-0.85, 0.35, 0.04]}>
        <boxGeometry args={[0.45, 0.36, 0.015]} />
        <meshStandardMaterial color="#b8922a" metalness={0.98} roughness={0.05} />
      </mesh>

      {/* Chip inner lines */}
      <mesh position={[-0.85, 0.35, 0.048]}>
        <boxGeometry args={[0.32, 0.24, 0.002]} />
        <meshStandardMaterial color="#d4a83a" metalness={1} roughness={0.02} />
      </mesh>

      {/* NFC antenna ring — outer */}
      <mesh position={[0.6, 0, 0.032]}>
        <torusGeometry args={[0.55, 0.012, 8, 48]} />
        <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.7} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* NFC antenna ring — mid */}
      <mesh position={[0.6, 0, 0.032]}>
        <torusGeometry args={[0.36, 0.009, 8, 48]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* NFC antenna ring — inner */}
      <mesh position={[0.6, 0, 0.032]}>
        <torusGeometry args={[0.18, 0.008, 8, 32]} />
        <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* NFC center dot */}
      <mesh position={[0.6, 0, 0.038]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={1} />
      </mesh>

      {/* Brand label area */}
      <mesh position={[-0.6, -0.6, 0.034]}>
        <boxGeometry args={[1.2, 0.12, 0.002]} />
        <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Subtle surface sheen */}
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[3.18, 1.98]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.03}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  )
}

export default function NFCTag3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-4, 4, 3]} intensity={0.8} color="#8A2BE2" />
      <pointLight position={[4, -3, 2]} intensity={0.5} color="#00FFFF" />
      <pointLight position={[0, 0, 4]} intensity={0.3} color="#ffffff" />
      <CardMesh mouseX={mouse.x} mouseY={mouse.y} />
    </Canvas>
  )
}
