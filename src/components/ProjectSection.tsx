// src/components/ProjectSection.tsx
'use client'
import { useState } from "react"
import ProjectWorld from "./ProjectWorld"
import ProjectList from "./ProjectList"
import { Box, List } from "lucide-react"

type ViewMode = '3d' | 'list'

interface ViewToggleProps {
    currentView: ViewMode
    onViewChange: (view: ViewMode) => void
}

export default function ProjectsSection() {
    const [viewMode, setViewMode] = useState<ViewMode>('3d')
    const [isTransitioning, setIsTransitioning] = useState(false)

    const handleViewChange = async (newView: ViewMode) => {
        if (newView === viewMode || isTransitioning) return

        setIsTransitioning(true)
        
        // より長い遅延でWebGLコンテキストを確実にクリーンアップ
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setViewMode(newView)
        
        // 新しいビューの安定化を待つ
        await new Promise(resolve => setTimeout(resolve, 200))
        
        setIsTransitioning(false)
    }

    return (
        <div className="relative">
            <h2 className="sr-only">最近のプロジェクト</h2>

            {/* トグルボタン */}
            <ViewToggle
                currentView={viewMode}
                onViewChange={handleViewChange}
            />

            {/* 表示切り替え - より安全な条件レンダリング */}
            <div className="w-full h-full">
                {isTransitioning && (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-gray-500">切り替え中...</div>
                    </div>
                )}
                
                {!isTransitioning && viewMode === '3d' && (
                    <div key="3d-container" className="w-full">
                        <ProjectWorld />
                    </div>
                )}
                
                {!isTransitioning && viewMode === 'list' && (
                    <div key="list-container" className="w-full">
                        <ProjectList limit={30} />
                    </div>
                )}
            </div>
        </div>
    )
}


// トグルボタンコンポーネント
function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="absolute top-4 left-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
                <div className="flex">
                    <button
                        onClick={() => onViewChange('3d')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-l-xl transition-all duration-200 ${
                            currentView === '3d'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Box className="w-4 h-4" />
                        <span className="text-sm font-medium">3D</span>
                    </button>
                    
                    <button
                        onClick={() => onViewChange('list')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-r-xl transition-all duration-200 ${
                            currentView === 'list'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <List className="w-4 h-4" />
                        <span className="text-sm font-medium">リスト</span>
                    </button>
                </div>
            </div>
        </div>
    )
}