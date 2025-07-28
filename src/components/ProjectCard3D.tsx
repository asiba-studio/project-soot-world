// src/components/ProjectCard3D.tsx
import React from 'react'
import type { ProjectWithMembers } from '@/lib/types'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'

interface ProjectCard3DProps {
  project: ProjectWithMembers
  position?: [number, number, number]
  onCardClick?: (project: ProjectWithMembers) => void
}

export default function ProjectCard3D({ project, position = [0, 0, 0], onCardClick }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [cardSize, setCardSize] = useState<[number, number]>([2, 3])

  // アニメーション設定
  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: {
      tension: 120,
      friction: 30,
      mass: 1
    }
  })

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

  // クリックハンドラーでレイキャスティングを制御
  const handleClick = (event: any) => {
    // イベントの伝播を停止
    event.stopPropagation()

    // 全てのintersectionを取得し、カメラに最も近いものを確認
    if (event.intersections && event.intersections.length > 0) {
      // カメラからの距離でソート
      const sortedIntersections = event.intersections.sort(
        (a: any, b: any) => a.distance - b.distance
      )

      // 最も近いオブジェクトが現在のカードかどうかを確認
      const closestObject = sortedIntersections[0].object
      if (meshRef.current && closestObject === meshRef.current) {
        onCardClick?.(project)
      }
    } else {
      // intersectionsが利用できない場合のフォールバック
      onCardClick?.(project)
    }
  }

  const handlePointerOver = (event: any) => {
    // 他のオブジェクトへの伝播を停止
    event.stopPropagation()

    // カメラからの距離を計算して、手前にあるかチェック
    if (meshRef.current && event.intersections) {
      const sortedIntersections = event.intersections.sort(
        (a: any, b: any) => a.distance - b.distance
      )

      if (sortedIntersections[0]?.object === meshRef.current) {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }
    } else {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (event: any) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <animated.group position={animatedPosition}>
      {/* カード本体 - 固定サイズ */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        renderOrder={-position[2]}
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
    </animated.group>
  )
}