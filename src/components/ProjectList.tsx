// src/components/ProjectsList.tsx
'use client'
import React, { useState } from 'react'
import { useProjectsWithMembers } from '@/hook/useProjects'
import ProjectCard2D from '@/components/ProjectCard2D'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/types'

interface ProjectListProps {
  limit?: number
}

export default function ProjectList({ limit }: ProjectListProps) {
  const { projects, loading, error } = useProjectsWithMembers()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
        ))}
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

  let filteredProjects = projects
  if (categoryFilter !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.category === categoryFilter)
  }
  if (statusFilter !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status === statusFilter)
  }
  if (limit) {
    filteredProjects = filteredProjects.slice(0, limit)
  }

  return (
    <div className="space-y-6 pt-30 px-20">
      {/* Filters */}
      {!limit && (
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">すべて</option>
              {PROJECT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">すべて</option>
              {PROJECT_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {filteredProjects.map(project => (
          <ProjectCard2D key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">プロジェクトが見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}