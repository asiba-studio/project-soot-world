// src/components/ProjectCard.tsx
import React from 'react'
import type { ProjectWithMembers } from '@/lib/types'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'

interface ProjectCardProps {
  project: ProjectWithMembers
  onCardClick?: (project: ProjectWithMembers) => void
}

export default function ProjectCard({ project, onCardClick }: ProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [cardSize, setCardSize] = useState<[number, number]>([2, 3])

  // カードデザインパラメータ
  const cardPadding = 0.03
  const textBoxHeight = 0.15

  const position = useMemo(() => generateCardPositions(1)[0], [])

  const texture = useMemo(() => {

    const loader = new THREE.TextureLoader()
    const card = project.card || '/images/dummy.png'
    const tex = loader.load(card, (texture) => {
      const image = texture.image
      const imageAspect = image.width / image.height

      // 面積を6に固定して、アスペクト比に基づいてサイズを決定
      const targetArea = 6
      const height = Math.sqrt(targetArea / imageAspect)
      const width = height * imageAspect

      setCardSize([width, height])
    })

    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter

    return tex
  }, [project.card])



  return (
    <group position={position} onClick={() => onCardClick?.(project)}>
      {/* カード本体 - 固定サイズ */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={cardSize} />
        <meshBasicMaterial
          map={texture}
          color={clicked || hovered ? '#e0e0e0' : '#ffffff'}
          side={THREE.DoubleSide}
          transparent
          opacity={1.0}
        />
      </mesh>


    </group>
  )
}

// カードを3D空間にランダム配置する関数
function generateCardPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = []
  for (let i = 0; i < count; i++) {
    positions.push([
      (Math.random() - 0.5) * 20, // X: -10 から 10
      (Math.random() - 0.5) * 15, // Y: -7.5 から 7.5
      (Math.random() - 0.5) * 50
    ])
  }
  return positions
}

