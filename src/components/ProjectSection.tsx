// src/components/ProjectSection.tsx
//import { useState } from "react"
import ProjectWorld from "./ProjectWorld"
import ProjectList from "./ProjectList"
import { Box, List } from "lucide-react"


type ViewMode = '3d' | 'list'

interface ViewToggleProps {
    currentView: ViewMode
    onViewChange: (view: ViewMode) => void
}

export default function ProjectsSection() {
    //const [viewMode, setViewMode] = useState<ViewMode>('3d')

    return (
        <div className="relative">
            <h2 className="sr-only">最近のプロジェクトaa</h2>

            {/* トグルボタン}
            <ViewToggle
                currentView={viewMode}
                onViewChange={setViewMode}
            /> */}

            {/* 表示切り替え
            <div className="transition-opacity duration-300 ">
                {viewMode === '3d' ? (
                    <ProjectWorld />
                ) : (
                    <ProjectList limit={6} />
                )}
            </div> */}
            <ProjectWorld />
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