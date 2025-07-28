// src/components/ProjectCard3D.tsx
import React, { useMemo } from 'react'
import type { ProjectWithMembers } from '@/lib/types'
import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ProjectCard3DProps {
  project: ProjectWithMembers
  position?: [number, number, number] 
  onCardClick?: (project: ProjectWithMembers) => void
}

export default function ProjectCard3D({ project, position = [0, 0, 0], onCardClick }: ProjectCard3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  const { camera } = useThree()

  // アニメーション設定（reduce-motionを考慮）
  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: { 
      tension: 200, 
      friction: 25,
      mass: 0.8
    }
  })

  // カメラからの距離による表示制御（LOD）
  useFrame(() => {
    if (groupRef.current) {
      const distance = camera.position.distanceTo(groupRef.current.position)
      const shouldBeVisible = distance < 50 // 距離50以内のみ表示
      
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible)
      }
    }
  })

  // メンバー表示の最適化
  const displayMembers = useMemo(() => {
    if (!project.members || project.members.length === 0) return null
    
    const maxDisplay = 2 // 表示数を削減
    const visibleMembers = project.members.slice(0, maxDisplay)
    const remainingCount = project.members.length - maxDisplay
    
    return { visibleMembers, remainingCount }
  }, [project.members])

  // 開始日のフォーマット最適化
  const formattedDate = useMemo(() => {
    if (!project.start_date) return null
    return new Date(project.start_date).toLocaleDateString('ja-JP', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    })
  }, [project.start_date])

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onCardClick?.(project)
  }

  // 距離が遠い場合は何も表示しない
  if (!isVisible) {
    return null
  }

  return (
    <animated.group ref={groupRef} position={animatedPosition}>
      <Html
        transform
        occlude="blending" // occludeを軽量化
        position={[0, 0, 0.1]}
        style={{
          width: '240px', // サイズを少し小さく
          height: '160px',
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div 
          className={`
            bg-white rounded-md shadow-md border border-gray-200 overflow-hidden
            transition-transform duration-150 cursor-pointer will-change-transform
            ${hovered ? 'scale-105' : 'scale-100'}
          `}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* プロジェクト画像 - 最適化 */}
          <div className="relative h-20 bg-gray-100">
            <img 
              src={project.card || '/images/dummy.png'} 
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {/* カテゴリバッジ - 簡素化 */}
            <div className="absolute top-1 left-1">
              <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded font-medium">
                {project.category}
              </span>
            </div>
          </div>

          {/* プロジェクト情報 - 最小限 */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-xs mb-1.5 line-clamp-2">
              {project.title}
            </h3>
            
            {/* メンバー情報 - 最小限 */}
            {displayMembers && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {displayMembers.visibleMembers.map((member, index) => (
                  <span 
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {member.player.name}
                  </span>
                ))}
                {displayMembers.remainingCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    +{displayMembers.remainingCount}
                  </span>
                )}
              </div>
            )}

            {/* 開始日 - 簡素化 */}
            {formattedDate && (
              <div className="text-xs text-gray-400">
                {formattedDate}
              </div>
            )}
          </div>
        </div>
      </Html>
    </animated.group>
  )
}