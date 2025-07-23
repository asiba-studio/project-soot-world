// src/components/ProjectVisualizer3D.tsx
'use client'
import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ProjectWithMembers } from '@/lib/types'

interface ProjectVisualizer3DProps {
  projects: ProjectWithMembers[]
  layoutMode: 'random' | 'timeline' | 'category' | 'status'
}

// CSS3DRendererを動的に読み込み
const loadCSS3DRenderer = async () => {
  if (typeof window === 'undefined') return null
  
  // すでに読み込まれている場合
  if ((window as any).THREE?.CSS3DRenderer) {
    return (window as any).THREE.CSS3DRenderer
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://threejs.org/examples/js/renderers/CSS3DRenderer.js'
    script.onload = () => {
      resolve((window as any).THREE.CSS3DRenderer)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function ProjectVisualizer3D({ 
  projects, 
  layoutMode 
}: ProjectVisualizer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<{
    isDragging: boolean
    previousMousePosition: { x: number; y: number }
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const [CSS3DRenderer, setCSS3DRenderer] = useState<any>(null)

  useEffect(() => {
    // CSS3DRendererを読み込み
    loadCSS3DRenderer().then((renderer) => {
      if (renderer) {
        setCSS3DRenderer(renderer)
      }
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (!mountRef.current || !CSS3DRenderer) return

    // Three.js初期化
    initializeThreeJS()
    
    // プロジェクト配置
    positionProjects()

    // イベントリスナー追加
    addEventListeners()

    setIsInitialized(true)

    return () => {
      // クリーンアップ
      if (rendererRef.current && mountRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {
          // すでに削除されている場合のエラーを無視
        }
      }
      removeEventListeners()
    }
  }, [CSS3DRenderer])

  useEffect(() => {
    if (isInitialized && CSS3DRenderer) {
      // レイアウトモードが変わったら再配置
      positionProjects()
    }
  }, [layoutMode, projects, isInitialized, CSS3DRenderer])

  const initializeThreeJS = () => {
    if (!mountRef.current || !CSS3DRenderer) return

    // シーンの作成
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(0, 0, 1500)
    cameraRef.current = camera

    // CSS3DRendererの作成
    const renderer = new CSS3DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.pointerEvents = 'auto'
    
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // コントロール初期化（削除 - 既に上で初期化済み）

    // 初期レンダリング
    renderer.render(scene, camera)
  }

  const positionProjects = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return

    // 既存の要素をクリア
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0])
    }

    projects.forEach((project, index) => {
      const position = calculatePosition(project, index, layoutMode)
      
      // HTML要素を作成
      const element = createProjectElement(project)
      
      // CSS3DObjectとして追加
      const CSS3DObject = (window as any).THREE.CSS3DObject
      const object = new CSS3DObject(element)
      object.position.set(position.x, position.y, position.z)
      object.userData = { project, originalPosition: position }
      
      sceneRef.current!.add(object)
    })

    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  const calculatePosition = (
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
  }

  const createProjectElement = (project: ProjectWithMembers): HTMLElement => {
    const element = document.createElement('div')
    element.className = 'project-card-3d'
    element.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-4 w-64 h-80 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        ${project.cover ? `
          <div class="w-full h-32 mb-3 overflow-hidden rounded">
            <img src="${project.cover}" alt="${project.title}" class="w-full h-full object-cover" />
          </div>
        ` : ''}
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}">
              ${project.category}
            </span>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}">
              ${project.status}
            </span>
          </div>
          <h3 class="font-semibold text-gray-900 text-sm line-clamp-2">${project.title}</h3>
          ${project.subtitle ? `<p class="text-xs text-gray-600 line-clamp-1">${project.subtitle}</p>` : ''}
          <p class="text-xs text-gray-700 line-clamp-3">${project.description || ''}</p>
          <div class="flex items-center text-xs text-gray-600">
            <span>${new Date(project.start_date).toLocaleDateString('ja-JP')}</span>
          </div>
          ${project.members.length > 0 ? `
            <div class="text-xs text-gray-600">
              ${project.members.slice(0, 2).map(m => m.player.name).join(', ')}
              ${project.members.length > 2 ? ` 他${project.members.length - 2}名` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `

    // クリックイベント
    element.addEventListener('click', () => {
      window.location.href = `/projects/${project.id}`
    })

    return element
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'スタジオ案件': 'bg-blue-100 text-blue-800',
      'ワークショップ案件': 'bg-green-100 text-green-800',
      'トークセッション登壇': 'bg-purple-100 text-purple-800',
      'インキュベーション参加者によるプロジェクト': 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      '企画中': 'bg-yellow-100 text-yellow-800',
      '進行中': 'bg-blue-100 text-blue-800',
      '完了': 'bg-green-100 text-green-800',
      '中止': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const addEventListeners = () => {
    if (!rendererRef.current) return

    const domElement = rendererRef.current.domElement

    domElement.addEventListener('mousedown', onMouseDown)
    domElement.addEventListener('mousemove', onMouseMove)
    domElement.addEventListener('mouseup', onMouseUp)
    domElement.addEventListener('wheel', onWheel)
  }

  const removeEventListeners = () => {
    if (!rendererRef.current) return

    const domElement = rendererRef.current.domElement
    
    domElement.removeEventListener('mousedown', onMouseDown)
    domElement.removeEventListener('mousemove', onMouseMove)
    domElement.removeEventListener('mouseup', onMouseUp)
    domElement.removeEventListener('wheel', onWheel)
  }

  const onMouseDown = (event: MouseEvent) => {
    controlsRef.current.isDragging = true
    controlsRef.current.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!controlsRef.current.isDragging || !cameraRef.current || !rendererRef.current || !sceneRef.current) return

    const deltaX = event.clientX - controlsRef.current.previousMousePosition.x
    const deltaY = event.clientY - controlsRef.current.previousMousePosition.y

    // カメラの平行移動（SOOT WORLD風）
    const moveSpeed = 2
    cameraRef.current.position.x -= deltaX * moveSpeed
    cameraRef.current.position.y += deltaY * moveSpeed

    controlsRef.current.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  const onMouseUp = () => {
    controlsRef.current.isDragging = false
  }

  const onWheel = (event: WheelEvent) => {
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return

    event.preventDefault()

    // ズーム制御
    const zoomSpeed = 50
    cameraRef.current.position.z += event.deltaY * zoomSpeed
    
    // ズーム制限
    cameraRef.current.position.z = Math.max(500, Math.min(3000, cameraRef.current.position.z))

    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }

  // CSS3DRendererが読み込まれていない場合のローディング表示
  if (!CSS3DRenderer) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">3D可視化システムを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-screen relative overflow-hidden bg-gray-50"
      style={{ cursor: controlsRef.current.isDragging ? 'grabbing' : 'grab' }}
    />
  )
}