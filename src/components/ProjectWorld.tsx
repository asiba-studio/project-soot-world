// src/components/ProjectWorld.tsx
'use client'
import React, { useState } from 'react'
import { useProjectsWithMembers } from '@/hook/useProjects'
import ProjectCard from '@/components/ProjectCard'
import { ProjectWithMembers } from '@/lib/types'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { ArcballControls, OrbitControls } from '@react-three/drei'
import { PerspectiveCamera } from '@react-three/drei'





// メインシーンコンポーネント
interface SceneProps {
    onCardClick: (project: ProjectWithMembers) => void
    projects: ProjectWithMembers[]
}

function Scene({ onCardClick, projects }: SceneProps) {

    return (
        <>
            {/* 環境光 */}
            <ambientLight intensity={0.4} />

            {/* メインライト */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                color="#ffffff"
            />

            {/* 補助ライト */}
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff9999" />
            <pointLight position={[10, -10, 10]} intensity={0.3} color="#9999ff" />

            {/* カードを配置 */}
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onCardClick={onCardClick}
                />
            ))}


            <PerspectiveCamera
                makeDefault
                position={[0, 0, 100]}  // カメラの初期位置
                fov={15}                // 視野角（Field of View）
                near={0.1}              // ニアクリップ
                far={1000}              // ファークリップ
            />

            {/* カメラコントロール */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={false}        // 回転は引き続き無効
                panSpeed={2.5}
                zoomSpeed={0.8}
                minDistance={10}            // orthographicのzoomの代わりにdistanceを使用
                maxDistance={500}
                target={[0, 0, -30]}          // カメラが向く中心点
                mouseButtons={{
                    LEFT: THREE.MOUSE.PAN,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                }}
            />
        </>
    )
}




interface ProjectWorldProps {
    limit?: number
}

export default function ProjectWorld({ limit }: ProjectWorldProps) {
    const { projects, loading, error } = useProjectsWithMembers()

    const [selectedCard, setSelectedCard] = useState<ProjectWithMembers | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)

    const handleCardClick = (project: ProjectWithMembers) => {
        setSelectedCard(project)
    }

    // 読み込み完了を検知
    React.useEffect(() => {
        // シンプルなタイマーベースのローディング
        const timer = setInterval(() => {
            setLoadingProgress(prev => {
                const newProgress = prev + Math.random() * 15
                if (newProgress >= 100) {
                    setLoadingProgress(100)
                    setTimeout(() => setIsLoading(false), 500)
                    clearInterval(timer)
                    return 100
                }
                return newProgress
            })
        }, 150)

        // 最大5秒でローディングを強制終了
        const maxTimer = setTimeout(() => {
            setLoadingProgress(100)
            setIsLoading(false)
            clearInterval(timer)
        }, 5000)

        return () => {
            clearInterval(timer)
            clearTimeout(maxTimer)
        }
    }, [])

    if (loading || isLoading) {
        return (
            <div className="">
                loading...
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">エラーが発生しました: {error}</p>
            </div>
        )
    }

    let filteredProjects = projects //いずれフィルターを追加する



    return (
        <div className="relative w-full h-screen">

            {/* 3Dキャンバス */}
            <div className="absolute inset-0">
                <Canvas
                    orthographic
                    camera={{
                        position: [0, 0, 100],  // カメラをさらに遠くに配置
                        zoom: 30,               // ズーム値をさらに下げて全体表示
                        near: 0.1,
                        far: 2000               // 描画距離を拡大
                    }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance"
                    }}
                >
                    <Scene onCardClick={handleCardClick} projects={filteredProjects} />
                </Canvas>
            </div>

            {/* 選択されたカード情報 */}
            {selectedCard && (
                <div className="absolute top-16 right-6 w-[20vw] bg-white text-blue-800 p-4 rounded-sm">
                    <h3 className="text-sm font-semibold">Selected Project</h3>
                    <div className="text-xl font-bold text-blue-800">{selectedCard.title}</div>
                    <img src={selectedCard.cover!} className='w-full my-1' />
                    <div className="text-sm opacity-75 my-1">
                        <p><strong>Category:</strong> {selectedCard.category}</p>
                        <p><strong>Status:</strong> {selectedCard.status}</p>
                        <p><strong>Members:</strong> {selectedCard.members.map(m => m.player.name).join(', ')}</p>
                        <p><strong>Started At:</strong> {new Date(selectedCard.start_date).toLocaleDateString()}</p>
                        <p><strong>Keywords:</strong> {selectedCard.keywords.join(', ')}</p>
                    </div>
                    <p className='text-sm font-semibold my-1 opacity-75'>
                        {selectedCard.description}
                    </p>

                </div>
            )}

            {/* 操作方法 */}
            <div className="fixed bottom-6 left-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl max-w-sm">
                <h3 className="text-lg font-semibold mb-3">🎮 Controls</h3>
                <div className="space-y-2 text-sm">
                    <p>🖱️ <strong>Drag:</strong> Move camera (Pan)</p>
                    <p>🔍 <strong>Scroll:</strong> Zoom in/out</p>
                    <p>👆 <strong>Hover:</strong> Cards glow softly</p>
                    <p>🎯 <strong>Click:</strong> Cards glow brightly</p>
                    <p>🚫 <strong>No rotation:</strong> Always front view</p>
                </div>
            </div>

        </div>
    )
}