// src/components/ProjectCard.tsx
import React from 'react'
import type { ProjectWithMembers } from '@/lib/types'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

interface ProjectCardProps {
  project: ProjectWithMembers
}

export default function ProjectCard({ project }: ProjectCardProps) {
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
    const cover = project.cover || '/images/dummy.png'
    const tex = loader.load(cover, (texture) => {
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
  }, [project.cover])

  return (
    <group position={position}>
      {/* カード本体 - 固定サイズ */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={cardSize} /> {/* サイズを少し大きく固定 */}
        <meshBasicMaterial
          map={texture}
          //color={clicked || hovered ? '#e0e0e0' : '#ffffff'}
          color="white"
          side={THREE.DoubleSide}
          transparent
          opacity={1.0}
        />
      </mesh>

      <Text
        position={[-cardSize[0] * 0.5, cardSize[1] * 0.5 + cardPadding * 0.5, 0.001]}
        fontSize={0.1}              // フォントサイズを調整
        color="black"
        anchorX="left"
        anchorY="bottom"
        fontWeight="bold"
      >
        <meshBasicMaterial
          color="black"
          transparent
          opacity={1.0}
        />
        {project.title || 'プロジェクト名未設定'}
      </Text>

      {/* テキスト背景 */}
      <mesh position={[0, textBoxHeight * 0.5, -0.001]}>
        <planeGeometry args={[cardSize[0] + cardPadding * 2, cardSize[1] + cardPadding * 2 + textBoxHeight]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={1.0}
        />
      </mesh>

      <mesh position={[0, textBoxHeight * 0.5, 0.002]}>
        <planeGeometry args={[cardSize[0] + cardPadding * 2, cardSize[1] + cardPadding * 2 + textBoxHeight]} />
        <meshBasicMaterial
          color="black"
          transparent
          opacity={clicked || hovered ? 0.33 : 0.0}
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

