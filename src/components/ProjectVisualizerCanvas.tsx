// src/components/ProjectVisualizerCanvas.tsx
'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ProjectWithMembers } from '@/lib/types'

interface ProjectVisualizerCanvasProps {
  projects: ProjectWithMembers[]
  layoutMode: 'random' | 'timeline' | 'category' | 'status'
}

interface ProjectNode {
  project: ProjectWithMembers
  x: number
  y: number
  z: number
  screenX: number
  screenY: number
  scale: number
}

export default function ProjectVisualizerCanvas({ 
  projects, 
  layoutMode 
}: ProjectVisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<ProjectNode[]>([])
  const [camera, setCamera] = useState({ x: 0, y: 0, z: 1500 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })

  // プロジェクトの位置を計算
  const calculatePosition = useCallback((
    project: ProjectWithMembers, 
    index: number, 
    mode: string
  ): { x: number; y: number; z: number } => {
    const spacing = 400

    switch (mode) {
      case 'timeline':
        const date = new Date(project.start_date)
        const yearOffset = (date.getFullYear() - 2024) * 800
        return {
          x: (index % 3 - 1) * spacing,
          y: (Math.floor(index / 3) - 1) * spacing,
          z: yearOffset
        }

      case 'category':
        const categories = ['スタジオ案件', 'ワークショップ案件', 'トークセッション登壇', 'インキュベーション参加者によるプロジェクト']
        const categoryIndex = categories.indexOf(project.category)
        return {
          x: (categoryIndex - 1.5) * spacing,
          y: (index % 2 - 0.5) * spacing,
          z: Math.random() * 200 - 100
        }

      case 'status':
        const statuses = ['企画中', '進行中', '完了', '中止']
        const statusIndex = statuses.indexOf(project.status)
        return {
          x: (index % 3 - 1) * spacing,
          y: (statusIndex - 1.5) * spacing,
          z: Math.random() * 200 - 100
        }

      case 'random':
      default:
        return {
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: (Math.random() - 0.5) * 1000
        }
    }
  }, [])

  // ノードの初期化
  useEffect(() => {
    const newNodes: ProjectNode[] = projects.map((project, index) => {
      const position = calculatePosition(project, index, layoutMode)
      return {
        project,
        x: position.x,
        y: position.y,
        z: position.z,
        screenX: 0,
        screenY: 0,
        scale: 1
      }
    })
    setNodes(newNodes)
  }, [projects, layoutMode, calculatePosition])

  // 3D→2D投影
  const projectTo2D = useCallback((node: ProjectNode, cameraPos: { x: number; y: number; z: number }) => {
    const canvas = canvasRef.current
    if (!canvas) return { screenX: 0, screenY: 0, scale: 0.5 }

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // カメラ相対位置
    const relativeX = node.x - cameraPos.x
    const relativeY = node.y - cameraPos.y
    const relativeZ = node.z - cameraPos.z

    // 簡単な透視投影
    const distance = Math.max(relativeZ, 100)
    const scale = Math.max(0.1, Math.min(2, cameraPos.z / distance))
    
    const screenX = centerX + (relativeX * scale)
    const screenY = centerY - (relativeY * scale)

    return { screenX, screenY, scale }
  }, [])

  // 描画
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ノードを距離でソート（遠いものから描画）
    const sortedNodes = [...nodes].sort((a, b) => (b.z - camera.z) - (a.z - camera.z))

    sortedNodes.forEach(node => {
      const projection = projectTo2D(node, camera)
      
      // 画面外のノードはスキップ
      if (projection.screenX < -100 || projection.screenX > canvas.width + 100 ||
          projection.screenY < -100 || projection.screenY > canvas.height + 100) {
        return
      }

      const cardWidth = 200 * projection.scale
      const cardHeight = 250 * projection.scale

      // カード背景
      ctx.fillStyle = 'white'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 10 * projection.scale
      ctx.shadowOffsetY = 5 * projection.scale
      ctx.fillRect(
        projection.screenX - cardWidth / 2,
        projection.screenY - cardHeight / 2,
        cardWidth,
        cardHeight
      )
      ctx.shadowBlur = 0

      // カテゴリバッジ
      const badgeColor = getCategoryColor(node.project.category)
      ctx.fillStyle = badgeColor
      ctx.fillRect(
        projection.screenX - cardWidth / 2 + 10 * projection.scale,
        projection.screenY - cardHeight / 2 + 10 * projection.scale,
        80 * projection.scale,
        20 * projection.scale
      )

      // テキスト
      ctx.fillStyle = '#1f2937'
      ctx.font = `${Math.max(12, 14 * projection.scale)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
      ctx.textAlign = 'center'
      
      // タイトル
      const title = node.project.title.length > 20 
        ? node.project.title.substring(0, 20) + '...'
        : node.project.title
      
      ctx.fillText(
        title,
        projection.screenX,
        projection.screenY - 10 * projection.scale
      )

      // 日付
      ctx.font = `${Math.max(10, 12 * projection.scale)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
      ctx.fillStyle = '#6b7280'
      ctx.fillText(
        new Date(node.project.start_date).toLocaleDateString('ja-JP'),
        projection.screenX,
        projection.screenY + 10 * projection.scale
      )
    })
  }, [nodes, camera, projectTo2D])

  // カテゴリ色の取得
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'スタジオ案件': '#3b82f6',
      'ワークショップ案件': '#10b981',
      'トークセッション登壇': '#8b5cf6',
      'インキュベーション参加者によるプロジェクト': '#f59e0b'
    }
    return colors[category] || '#6b7280'
  }

  // イベントハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouse.x
    const deltaY = e.clientY - lastMouse.y

    setCamera(prev => ({
      ...prev,
      x: prev.x - deltaX * 2,
      y: prev.y + deltaY * 2
    }))

    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setCamera(prev => ({
      ...prev,
      z: Math.max(500, Math.min(3000, prev.z + e.deltaY))
    }))
  }

  // 描画ループ
  useEffect(() => {
    draw()
  }, [draw])

  // キャンバスサイズの調整
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-gray-50"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  )
}