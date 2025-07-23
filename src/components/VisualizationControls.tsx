// src/components/VisualizationControls.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Shuffle, Calendar, Grid, Target, Filter, Home, X } from 'lucide-react'
import Link from 'next/link'
import { ProjectWithMembers, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/types'

interface VisualizationControlsProps {
  projects: ProjectWithMembers[]
  layoutMode: 'random' | 'timeline' | 'category' | 'status'
  onLayoutModeChange: (mode: 'random' | 'timeline' | 'category' | 'status') => void
  onProjectsFiltered: (projects: ProjectWithMembers[]) => void
}

export default function VisualizationControls({
  projects,
  layoutMode,
  onLayoutModeChange,
  onProjectsFiltered
}: VisualizationControlsProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    dateRange: 'all'
  })

  useEffect(() => {
    // フィルタが変更されたらプロジェクトをフィルタリング
    let filtered = [...projects]

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    if (filters.dateRange !== 'all') {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      switch (filters.dateRange) {
        case 'thisYear':
          filtered = filtered.filter(p => 
            new Date(p.start_date).getFullYear() === currentYear
          )
          break
        case 'lastYear':
          filtered = filtered.filter(p => 
            new Date(p.start_date).getFullYear() === currentYear - 1
          )
          break
      }
    }

    onProjectsFiltered(filtered)
  }, [filters, projects, onProjectsFiltered])

  const layoutModes = [
    { key: 'random', label: 'ランダム', icon: Shuffle },
    { key: 'timeline', label: 'タイムライン', icon: Calendar },
    { key: 'category', label: 'カテゴリ', icon: Grid },
    { key: 'status', label: 'ステータス', icon: Target }
  ] as const

  return (
    <>
      {/* メインコントロールパネル */}
      <div className="absolute top-4 left-4 space-y-3">
        {/* ホームボタン */}
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
        >
          <Home size={20} className="text-gray-700" />
        </Link>

        {/* レイアウトモード選択 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
          <div className="text-xs font-medium text-gray-600 mb-2 px-2">レイアウト</div>
          <div className="space-y-1">
            {layoutModes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onLayoutModeChange(key)}
                className={`w-full flex items-center px-3 py-2 rounded text-sm transition-all duration-200 ${
                  layoutMode === key
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* フィルターボタン */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 ${
            showFilters
              ? 'bg-blue-500 text-white'
              : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
          }`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="absolute top-4 left-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">フィルター</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* カテゴリフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                {PROJECT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* ステータスフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                {PROJECT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* 期間フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                <option value="thisYear">今年</option>
                <option value="lastYear">昨年</option>
              </select>
            </div>

            {/* フィルターリセット */}
            <button
              onClick={() => setFilters({ category: 'all', status: 'all', dateRange: 'all' })}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              フィルターをリセット
            </button>
          </div>
        </div>
      )}
    </>
  )
}