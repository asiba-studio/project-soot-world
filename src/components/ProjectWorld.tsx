// src/components/ProjectWorld.tsx
'use client'
import React, { useState} from 'react'
import { useProjectsWithMembers } from '@/hook/useProjects'
import ProjectCard from '@/components/ProjectCard'
import { ProjectWithMembers } from '@/lib/types'
import { Canvas} from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'




// メインシーンコンポーネント
interface SceneProps {
    onCardClick: (animal: string) => void
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
                color="
#ffffff"
            />

            {/* 補助ライト */}
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="
#ff9999" />
            <pointLight position={[10, -10, 10]} intensity={0.3} color="
#9999ff" />

            {/* カードを配置 */}
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}

            {/* カメラコントロール */}
            <OrbitControls
                enablePan={true}       // パン（移動）を有効
                enableZoom={true}      // ズームを有効
                enableRotate={false}   // 回転は無効のまま
                panSpeed={1.5}         // パンの速度を少し上げる
                zoomSpeed={0.8}        // ズームの速度
                minZoom={2}            // 最小ズーム（かなり遠くまで）
                maxZoom={200}          // 最大ズーム（かなり近くまで）
                mouseButtons={{
                    LEFT: THREE.MOUSE.PAN,    // 左クリック：パン
                    MIDDLE: THREE.MOUSE.DOLLY, // 中クリック：ズーム
                    RIGHT: THREE.MOUSE.PAN     // 右クリック：パン
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

    const [selectedCard, setSelectedCard] = useState<string | null>(null)
    const [cardHistory, setCardHistory] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)

    const handleCardClick = (title: string) => {
        setSelectedCard(title)
        setCardHistory(prev => {
            const newHistory = [title, ...prev.filter(a => a !== title)]
            return newHistory.slice(0, 5) // 最新5件まで保持
        })
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
        <div className="space-y-6">

            {/* 3Dキャンバス */}
            <div className="fixed inset-0">
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
                <div className="absolute top-20 left-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Selected Animal</h3>
                    <div className="text-2xl font-bold text-yellow-300">{selectedCard}</div>
                    <div className="text-sm opacity-75 mt-1">
                        Click another card to change selection
                    </div>
                </div>
            )}

            {/* 操作方法 */}
            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl max-w-sm">
                <h3 className="text-lg font-semibold mb-3">🎮 Controls</h3>
                <div className="space-y-2 text-sm">
                    <p>🖱️ <strong>Drag:</strong> Move camera (Pan)</p>
                    <p>🔍 <strong>Scroll:</strong> Zoom in/out</p>
                    <p>👆 <strong>Hover:</strong> Cards glow softly</p>
                    <p>🎯 <strong>Click:</strong> Cards glow brightly</p>
                    <p>🚫 <strong>No rotation:</strong> Always front view</p>
                </div>
            </div>

            {/* 最近選択したカード履歴 */}
            {cardHistory.length > 0 && (
                <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-white p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">📝 Recent Selections</h3>
                    <div className="space-y-1">
                        {cardHistory.map((animal, index) => (
                            <div
                                key={`${animal}-${index}`}
                                className={`text-sm ${index === 0 ? 'text-yellow-300 font-semibold' : 'text-gray-300'}`}
                            >
                                {index + 1}. {animal}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}