import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Points, PointMaterial } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function DNAHelix({ mouse }) {
  const group = useRef()

  useFrame(() => {
    if (!group.current) return

    // smoother rotation
    group.current.rotation.y += 0.0018

    // softer mouse interaction
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.2,
      0.04
    )
    group.current.rotation.y += THREE.MathUtils.lerp(
      0,
      mouse.current.x * 0.15,
      0.015
    )
  })

  const points = []
  const height = 5
  const turns = 20

  for (let i = 0; i < turns; i++) {
    const t = (i / turns) * Math.PI * 2
    const y = (i / turns) * height - height / 2

    points.push({
      x1: Math.sin(t) * 1.1, // 🔥 slightly reduced spread
      z1: Math.cos(t) * 1.1,
      x2: Math.sin(t + Math.PI) * 1.1,
      z2: Math.cos(t + Math.PI) * 1.1,
      y
    })
  }

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <group key={i}>
          <mesh position={[p.x1, p.y, p.z1]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="#0B7B6F" roughness={0.4} />
          </mesh>

          <mesh position={[p.x2, p.y, p.z2]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="#6ED3C2" roughness={0.4} />
          </mesh>

          <mesh
            position={[
              (p.x1 + p.x2) / 2,
              p.y,
              (p.z1 + p.z2) / 2
            ]}
            rotation={[0, Math.atan2(p.x2 - p.x1, p.z2 - p.z1), Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, 2.1, 12]} />
            <meshStandardMaterial color="#BFEDE6" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ✨ PARTICLES (less intense) */
function Particles() {
  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < 180; i++) { // 🔥 reduced count
      arr.push((Math.random() - 0.5) * 8)
      arr.push((Math.random() - 0.5) * 8)
      arr.push((Math.random() - 0.5) * 8)
    }
    return new Float32Array(arr)
  }, [])

  return (
    <Points positions={positions}>
      <PointMaterial size={0.035} color="#0FA898" transparent opacity={0.25} />
    </Points>
  )
}

export default function DNA3D() {
  const mouse = useRef({ x: 0, y: 0 })

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouse.current.x = (e.clientX - rect.left) / rect.width - 0.5
        mouse.current.y = (e.clientY - rect.top) / rect.height - 0.5
      }}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>

        {/* 💡 Softer lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={0.9} />
        <pointLight position={[-3, -2, -2]} intensity={0.3} />

        {/* ✨ Particles */}
        <Particles />

        {/* 🧬 DNA (reduced dominance) */}
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1.2}>
          <group scale={0.9}> {/* 🔥 reduced from 1.05 */}
            <DNAHelix mouse={mouse} />
          </group>
        </Float>

      </Canvas>
    </div>
  )
}