// src/app/visualize/page.tsx
'use client'
import React, { useState } from 'react'
import ProjectVisualizerCanvas from '@/components/ProjectVisualizerCanvas'
import VisualizationControls from '@/components/VisualizationControls'
import { useProjectsWithMembers } from '@/hook/useProjects'

export default function VisualizePage() {
  const { projects, loading, error } = useProjectsWithMembers()
  const [layoutMode, setLayoutMode] = useState<'random' | 'timeline' | 'category' | 'status'>('random')
  const [filteredProjects, setFilteredProjects] = useState(projects)

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">プロジェクトを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Canvas可視化エリア */}
      <ProjectVisualizerCanvas 
        projects={filteredProjects.length > 0 ? filteredProjects : projects}
        layoutMode={layoutMode}
      />

      {/* UI コントロール */}
      <VisualizationControls
        projects={projects}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        onProjectsFiltered={setFilteredProjects}
      />

      {/* 情報パネル */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-gray-900 mb-2">プロジェクト可視化</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• ドラッグで視点移動</p>
          <p>• ホイールでズーム</p>
          <p>• カードクリックで詳細</p>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <p>表示中: {filteredProjects.length > 0 ? filteredProjects.length : projects.length}件</p>
          <p>レイアウト: {getLayoutModeName(layoutMode)}</p>
        </div>
      </div>
    </div>
  )
}

function getLayoutModeName(mode: string): string {
  const names: Record<string, string> = {
    'random': 'ランダム',
    'timeline': 'タイムライン',
    'category': 'カテゴリ',
    'status': 'ステータス'
  }
  return names[mode] || mode
}