import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// deep imports: the drei root pulls in three-mesh-bvh, which needs a newer three
import { ContactShadows } from '@react-three/drei/core/ContactShadows'
import { Environment } from '@react-three/drei/core/Environment'
import { Lightformer } from '@react-three/drei/core/Lightformer'
import * as THREE from 'three'

// ── Content shown on the phone ───────────────────────────

const routines = [
  { tag: 'Coffee tag', title: 'Morning routine', time: '7:42', from: '#3b1477', to: '#0d0a16', accent: '#b07cff', actions: [['Spotify', 'Morning Vibes'], ['Lights', '80%'], ['Calendar', 'Standup 9:30']] },
  { tag: 'Car tag', title: 'Drive mode', time: '8:15', from: '#0b3b40', to: '#071214', accent: '#00FFFF', actions: [['Maps', 'Work, 23 min'], ['Hands-free', 'On'], ['Playlist', 'Resumed']] },
  { tag: 'Bedside tag', title: 'Night mode', time: '22:47', from: '#1d1240', to: '#07070c', accent: '#b07cff', actions: [['Lights', 'Off'], ['Do Not Disturb', 'On'], ['Alarm', '7:00']] },
]

type Phase = 'idle' | 'island' | 'done'

// ── Timing of one tap, in seconds ────────────────────────

const PERIOD = 5.2
const DIP_START = 2.4
const CONTACT = 2.8
const RISE_END = 3.5
const DIP = 0.34

const easeIn = (k: number) => k * k * k
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3)

function dipAt(p: number) {
  if (p < DIP_START || p > RISE_END) return 0
  if (p < CONTACT) return easeIn((p - DIP_START) / (CONTACT - DIP_START))
  return 1 - easeOut((p - CONTACT) / (RISE_END - CONTACT))
}

// ── Geometry helpers ─────────────────────────────────────

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

// flat rounded rectangle with 0..1 UVs, so a canvas texture maps onto it
function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 16)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h)
  return g
}

// phone body: rounded rectangle extruded with a soft bevel on the edges
function phoneBody(w: number, h: number, d: number, r: number, b: number) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w - 2 * b, h - 2 * b, r - b), {
    depth: d - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 5,
    curveSegments: 24,
  })
  g.translate(0, 0, -(d - 2 * b) / 2)
  g.computeVertexNormals()
  return g
}

// NFC tag: a puck with rounded edges, turned on a lathe
function puck(r: number, h: number, c: number) {
  const pts = [new THREE.Vector2(0, -h / 2)]
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2)
    pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, -h / 2 + c + Math.sin(a) * c))
  }
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2)
    pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, h / 2 - c + Math.sin(a) * c))
  }
  pts.push(new THREE.Vector2(0, h / 2))
  return new THREE.LatheGeometry(pts, 96)
}

// ── Canvas textures ──────────────────────────────────────

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function nfcArcs(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = s * 0.14
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2)
  ctx.fill()
  for (const k of [0.45, 0.78]) {
    ctx.beginPath()
    ctx.arc(cx, cy, s * k, -0.75, 0.75)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, s * k, Math.PI - 0.75, Math.PI + 0.75)
    ctx.stroke()
  }
}

const SCREEN_W = 464
const SCREEN_H = 1024

function drawScreen(ctx: CanvasRenderingContext2D, index: number, phase: Phase) {
  const r = routines[index]
  const W = SCREEN_W
  const H = SCREEN_H
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, r.from)
  bg.addColorStop(0.7, r.to)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // status bar
  ctx.fillStyle = '#fff'
  ctx.font = '600 28px Inter, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  if (phase !== 'idle') ctx.fillText(r.time, 46, 50)
  ctx.globalAlpha = 0.9
  pill(ctx, W - 92, 40, 44, 20, 6)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2.5
  ctx.stroke()
  pill(ctx, W - 88, 44, 32, 12, 3)
  ctx.fill()
  ctx.globalAlpha = 1

  // Dynamic Island, expanded into a live activity right after a tap
  if (phase === 'island') {
    const w = 360
    pill(ctx, (W - w) / 2, 18, w, 84, 42)
    ctx.fillStyle = '#000'
    ctx.fill()
    ctx.fillStyle = `${r.accent}44`
    ctx.beginPath()
    ctx.arc((W - w) / 2 + 46, 60, 28, 0, Math.PI * 2)
    ctx.fill()
    nfcArcs(ctx, (W - w) / 2 + 46, 60, 22, r.accent)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '600 16px Inter, sans-serif'
    ctx.fillText(r.tag.toUpperCase(), (W - w) / 2 + 88, 46)
    ctx.fillStyle = '#fff'
    ctx.font = '600 24px Inter, sans-serif'
    ctx.fillText(r.title, (W - w) / 2 + 88, 74)
    ctx.fillStyle = '#30d158'
    ctx.beginPath()
    ctx.arc((W + w) / 2 - 42, 60, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo((W + w) / 2 - 50, 60)
    ctx.lineTo((W + w) / 2 - 44, 67)
    ctx.lineTo((W + w) / 2 - 33, 53)
    ctx.stroke()
  } else {
    pill(ctx, (W - 124) / 2, 30, 124, 38, 19)
    ctx.fillStyle = '#000'
    ctx.fill()
  }

  ctx.textAlign = 'center'
  if (phase === 'idle') {
    ctx.fillStyle = '#fff'
    ctx.font = '300 150px "Space Grotesk", sans-serif'
    ctx.fillText('9:41', W / 2, 300)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '500 24px Inter, sans-serif'
    ctx.fillText('Hold near a TapFlow tag', W / 2, 870)
    nfcArcs(ctx, W / 2, 800, 34, 'rgba(255,255,255,0.7)')
    return
  }

  // big clock
  ctx.fillStyle = '#fff'
  ctx.font = '300 128px "Space Grotesk", sans-serif'
  ctx.fillText(r.time, W / 2, 250)

  // notification card listing what the routine just did
  const x = 28
  const y = 400
  const w = W - 56
  pill(ctx, x, y, w, 420, 36)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = r.accent
  ctx.font = '700 18px Inter, sans-serif'
  ctx.fillText('TAPFLOW', x + 30, y + 44)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.textAlign = 'right'
  ctx.font = '500 18px Inter, sans-serif'
  ctx.fillText('now', x + w - 30, y + 44)
  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff'
  ctx.font = '700 32px "Space Grotesk", sans-serif'
  ctx.fillText(`${r.title} started`, x + 30, y + 96)

  r.actions.forEach(([label, value], i) => {
    const ry = y + 168 + i * 80
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    pill(ctx, x + 18, ry - 32, w - 36, 64, 20)
    ctx.fill()
    ctx.fillStyle = '#30d158'
    ctx.beginPath()
    ctx.arc(x + 54, ry, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.moveTo(x + 47, ry)
    ctx.lineTo(x + 52, ry + 6)
    ctx.lineTo(x + 62, ry - 6)
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.font = '600 24px Inter, sans-serif'
    ctx.fillText(label, x + 84, ry)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.textAlign = 'right'
    ctx.font = '500 22px Inter, sans-serif'
    ctx.fillText(value, x + w - 36, ry)
    ctx.textAlign = 'left'
  })
}

function drawTagTop(ctx: CanvasRenderingContext2D) {
  const S = 512
  const c = S / 2
  const bg = ctx.createRadialGradient(c, c, 20, c, c, c)
  bg.addColorStop(0, '#4a1a96')
  bg.addColorStop(1, '#1a0838')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, S, S)
  // printed antenna coil
  ;[
    [228, 'rgba(0,255,255,0.55)', 3],
    [214, 'rgba(0,255,255,0.35)', 3],
    [200, 'rgba(0,255,255,0.22)', 3],
    [150, 'rgba(138,43,226,0.9)', 4],
  ].forEach(([r, color, w]) => {
    ctx.strokeStyle = color as string
    ctx.lineWidth = w as number
    ctx.beginPath()
    ctx.arc(c, c, r as number, 0, Math.PI * 2)
    ctx.stroke()
  })
  nfcArcs(ctx, c, c - 34, 42, 'rgba(255,255,255,0.9)')
  ctx.fillStyle = '#fff'
  ctx.font = '700 46px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TapFlow', c, c + 52)
}

function useCanvasTexture(w: number, h: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return { ctx: canvas.getContext('2d') as CanvasRenderingContext2D, texture }
  }, [w, h])
}

// ── Scene ────────────────────────────────────────────────

interface SceneProps {
  reduce: boolean
  tapRequest: React.MutableRefObject<boolean>
  pointer: React.MutableRefObject<{ x: number; y: number }>
}

const PHONE = { w: 1.42, h: 2.92, d: 0.15 }
const TAG_Y = -1.15
const PHONE_Y = 0.62

function Scene({ reduce, tapRequest, pointer }: SceneProps) {
  const invalidate = useThree(s => s.invalidate)
  const camera = useThree(s => s.camera)
  const root = useRef<THREE.Group>(null)
  const phone = useRef<THREE.Group>(null)
  const ripples = useRef<(THREE.Mesh | null)[]>([])
  const tagTopMat = useRef<THREE.MeshStandardMaterial>(null)
  const cycle = useRef({ start: -DIP_START, contacted: false, taps: 0, contactAt: -10 })

  const [routine, setRoutine] = useState(0)
  const [phase, setPhase] = useState<Phase>(reduce ? 'done' : 'idle')
  const [fontsReady, setFontsReady] = useState(false)

  const screen = useCanvasTexture(SCREEN_W, SCREEN_H)
  const tagTop = useCanvasTexture(512, 512)

  const geo = useMemo(
    () => ({
      body: phoneBody(PHONE.w, PHONE.h, PHONE.d, 0.2, 0.035),
      glass: roundedPlane(PHONE.w - 0.06, PHONE.h - 0.06, 0.17),
      display: roundedPlane(PHONE.w - 0.14, PHONE.h - 0.14, 0.13),
      puck: puck(1.05, 0.14, 0.05),
      bump: roundedPlane(0.62, 0.62, 0.14),
    }),
    [],
  )

  useLayoutEffect(() => {
    camera.lookAt(0, -0.05, 0)
  }, [camera])

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  useEffect(() => {
    drawScreen(screen.ctx, routine, phase)
    screen.texture.needsUpdate = true
    invalidate()
  }, [screen, routine, phase, fontsReady, invalidate])

  useEffect(() => {
    drawTagTop(tagTop.ctx)
    tagTop.texture.needsUpdate = true
    invalidate()
  }, [tagTop, fontsReady, invalidate])

  // the live activity collapses into the notification after a moment
  useEffect(() => {
    if (phase !== 'island') return
    const t = setTimeout(() => setPhase('done'), 1400)
    return () => clearTimeout(t)
  }, [phase, routine])

  useEffect(() => () => {
    Object.values(geo).forEach(g => g.dispose())
    screen.texture.dispose()
    tagTop.texture.dispose()
  }, [geo, screen, tagTop])

  useFrame(state => {
    const t = state.clock.elapsedTime
    const c = cycle.current

    if (reduce) {
      // no motion: a click just moves on to the next routine
      if (tapRequest.current) {
        tapRequest.current = false
        setRoutine(r => (r + 1) % routines.length)
      }
      return
    }

    let p = t - c.start
    if (tapRequest.current) {
      tapRequest.current = false
      if (p < DIP_START || p > RISE_END) {
        c.start = t - DIP_START
        c.contacted = false
        p = DIP_START
      }
    }
    if (p > PERIOD) {
      c.start = t
      c.contacted = false
      p = 0
    }
    if (p >= CONTACT && !c.contacted) {
      c.contacted = true
      c.contactAt = t
      if (c.taps > 0) setRoutine(r => (r + 1) % routines.length)
      c.taps += 1
      setPhase('island')
    }

    if (phone.current) {
      phone.current.position.y = PHONE_Y - dipAt(p) * DIP + Math.sin(t * 1.3) * 0.035
      phone.current.rotation.z = -0.06 + Math.sin(t * 0.9) * 0.015
    }

    if (root.current) {
      const ty = pointer.current.x * 0.35
      const tx = pointer.current.y * 0.12
      root.current.rotation.y += (ty - root.current.rotation.y) * 0.05
      root.current.rotation.x += (tx - root.current.rotation.x) * 0.05
    }

    const since = t - c.contactAt
    ripples.current.forEach((mesh, i) => {
      if (!mesh) return
      const local = since - i * 0.18
      const mat = mesh.material as THREE.MeshBasicMaterial
      if (local > 0 && local < 1.4) {
        const s = 1 + local * 1.5
        mesh.scale.set(s, s, s)
        mat.opacity = 0.6 * (1 - local / 1.4)
      } else {
        mat.opacity = 0
      }
    })
    if (tagTopMat.current) tagTopMat.current.emissiveIntensity = 0.35 + (since > 0 ? Math.exp(-since * 2.5) * 1.2 : 0)
  })

  return (
    <group ref={root}>
      {/* NFC tag */}
      <group position={[0, TAG_Y, 0]}>
        <mesh geometry={geo.puck}>
          <meshPhysicalMaterial color="#2b0f57" roughness={0.32} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>
        <mesh position={[0, 0.0705, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.98, 96]} />
          <meshStandardMaterial
            ref={tagTopMat}
            map={tagTop.texture}
            emissiveMap={tagTop.texture}
            emissive="#ffffff"
            emissiveIntensity={0.35}
            roughness={0.4}
          />
        </mesh>
        {[0, 1, 2].map(i => (
          <mesh
            key={i}
            ref={el => { ripples.current[i] = el }}
            position={[0, 0.075, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.0, 1.035, 96]} />
            <meshBasicMaterial color="#00FFFF" transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* phone, tilted back so its screen faces the camera */}
      <group ref={phone} position={[0.05, PHONE_Y, 0.15]} rotation={[-0.5, -0.32, -0.06]}>
        <mesh geometry={geo.body}>
          <meshPhysicalMaterial color="#26262e" metalness={0.85} roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
        <mesh geometry={geo.glass} position={[0, 0, PHONE.d / 2 + 0.001]}>
          <meshPhysicalMaterial color="#030305" roughness={0.06} clearcoat={1} metalness={0.2} />
        </mesh>
        <mesh geometry={geo.display} position={[0, 0, PHONE.d / 2 + 0.002]}>
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>

        {/* side buttons */}
        {[[0.72, 0.18], [0.42, 0.3], [0.06, 0.3]].map(([y, h]) => (
          <mesh key={y} position={[-PHONE.w / 2 - 0.008, y, 0]}>
            <boxGeometry args={[0.025, h, 0.06]} />
            <meshStandardMaterial color="#3a3a44" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[PHONE.w / 2 + 0.008, 0.48, 0]}>
          <boxGeometry args={[0.025, 0.46, 0.06]} />
          <meshStandardMaterial color="#3a3a44" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* camera module on the back */}
        <group position={[-0.3, 0.96, -PHONE.d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
          <mesh geometry={geo.bump}>
            <meshPhysicalMaterial color="#30303a" metalness={0.6} roughness={0.2} clearcoat={1} side={THREE.DoubleSide} />
          </mesh>
          {[[-0.14, 0.14], [0.14, -0.02], [-0.14, -0.14]].map(([x, y]) => (
            <mesh key={`${x}${y}`} position={[x, y, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 32]} />
              <meshPhysicalMaterial color="#08080c" metalness={0.5} roughness={0.1} clearcoat={1} />
            </mesh>
          ))}
        </group>
      </group>

      <ContactShadows position={[0, TAG_Y - 0.075, 0]} opacity={0.5} scale={7} blur={2.6} far={3} resolution={256} color="#000000" />
    </group>
  )
}

// ── Canvas wrapper ───────────────────────────────────────

export default function TapScene() {
  const wrapper = useRef<HTMLDivElement>(null)
  const tapRequest = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // stop rendering while the hero is scrolled away
  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // the scene follows the mouse anywhere on the page, not only over the canvas
  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce])

  return (
    <div
      ref={wrapper}
      className="w-full h-full cursor-pointer"
      onClick={() => { tapRequest.current = true }}
      title="Click to tap the phone on the tag"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.5, 7.7], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={!visible ? 'never' : reduce ? 'demand' : 'always'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <pointLight position={[-3, 1, 2]} intensity={8} distance={10} color="#8A2BE2" />
        <pointLight position={[3, -1, 2.5]} intensity={6} distance={10} color="#00FFFF" />
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 4, 3]} scale={[6, 2, 1]} />
          <Lightformer intensity={1.5} color="#8A2BE2" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} />
          <Lightformer intensity={1.2} color="#00FFFF" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 4, 1]} />
        </Environment>
        <Scene reduce={reduce} tapRequest={tapRequest} pointer={pointer} />
      </Canvas>
    </div>
  )
}
