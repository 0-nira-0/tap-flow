import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Howl } from 'howler'
import * as THREE from 'three'

// Short 50ms tick sound encoded inline (sine wave blip)
const tapSound = new Howl({
  src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqPkZOUlZWUk5GOi4eFgn57eHZ0cnBvbm5ub3BxcnR2eHt+gYSHioyOkJGSkpGQj42LiIaEgX97eXd1c3JxcHBwcXJzdXd5e36AhIeKjI6QkZKSkZCPjYuIhoN/fXp4dXRycXBwcHFycnR2eHt+gISHio2PkJGRkZCPjYuJhoN/fHp4dXNycXBwcHFyc3V3eXt+gIOHio2OkJGRkZCPjYuJhYJ/fHp3dXNycXBwcHFyc3V3eXx+gIOHioyOkJCRkZCPjYqIhYJ/fHp3dXNxcHBwcHBxc3V3eXx+g4eKjI+QkZGQj42LiIWCf3x6d3VycXBwcHBxc3R2eXt+g4aKjI+QkZGQj42LiIaDefx6d3VycXBwcHBxc3R2eXt9gIaJjI+QkZGQj42LiIaDefx6d3VycXBwcHBxc3R2eXt9gIaJjI+QkZGQj42LiIaDfXt5d3VycXBwcHBxc3R2eXx+gYaJjI+QkZGQj42LiIaDfXt4dnRycXBwcHBxc3R2eXx+gYaJjI+QkZCPjoyKiIaDfXt4dnRycXBwcHBxc3R2eXx+gYaJjI+QkZCPjoyKiIaDfXt4dnRycXBwcHBxc3R2eHt9gIWJjI6QkJCPjYuJiIWCfXt4dnRycXBwcA=='],
  volume: 0.3,
  html5: false,
})

interface TagMeshProps {
  mouseX: number
  mouseY: number
}

function TagMesh({ mouseX, mouseY }: TagMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const [hovered, setHovered] = useState(false)
  const [lightIntensity, setLightIntensity] = useState(0)
  const pulseTime = useRef(0)

  useEffect(() => {
    if (hovered) {
      pulseTime.current = 0
    }
  }, [hovered])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const elapsed = clock.elapsedTime
    groupRef.current.position.y = Math.sin(elapsed * 0.8) * 0.12

    const targetRotX = mouseY * 0.4
    const targetRotY = mouseX * 0.4
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05

    if (lightRef.current) {
      if (hovered) {
        pulseTime.current += 0.05
        const pulse = Math.sin(pulseTime.current * Math.PI) * 3
        setLightIntensity(Math.max(0, pulse))
        lightRef.current.intensity = Math.max(0, pulse)
      } else {
        lightRef.current.intensity = 0
        setLightIntensity(0)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        onPointerEnter={() => { setHovered(true); tapSound.play() }}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <cylinderGeometry args={[1, 1, 0.08, 64]} />
        <meshStandardMaterial
          color="#3D1070"
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* outer ring */}
      <mesh>
        <torusGeometry args={[1.05, 0.015, 8, 64]} />
        <meshStandardMaterial
          color="#8A2BE2"
          metalness={0.9}
          roughness={0.1}
          emissive="#8A2BE2"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* inner circuit lines */}
      <mesh>
        <torusGeometry args={[0.6, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      <mesh>
        <torusGeometry args={[0.3, 0.008, 8, 32]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        color="#8A2BE2"
        intensity={lightIntensity}
        distance={5}
      />
    </group>
  )
}

export default function NFCTag3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      setMouse({ x: nx, y: ny })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 3, 3]} intensity={0.5} color="#8A2BE2" />
      <pointLight position={[3, -2, 2]} intensity={0.3} color="#00FFFF" />
      <TagMesh mouseX={mouse.x} mouseY={mouse.y} />
    </Canvas>
  )
}
