// src/components/ProjectCard.tsx
import React from 'react'
import Link from 'next/link'
import { Calendar, Users, ExternalLink, MapPin } from 'lucide-react'
import type { ProjectWithMembers } from '@/lib/types'
import { getCategoryColor, getStatusColor } from '@/lib/utils'

interface ProjectCardProps {
  project: ProjectWithMembers
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const categoryColor = getCategoryColor(project.category)
  const statusColor = getStatusColor(project.status)

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Cover Image */}
      {project.cover && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category & Status Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {project.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {project.status}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-sm text-gray-600">{project.subtitle}</p>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Project Info */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>
              {new Date(project.start_date).toLocaleDateString('ja-JP')}
              {project.end_date && (
                <> 〜 {new Date(project.end_date).toLocaleDateString('ja-JP')}</>
              )}
            </span>
          </div>

          {/* Members */}
          {project.members.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Users size={16} className="mr-2" />
              <span>
                {project.members.slice(0, 3).map(member => member.player.name).join(', ')}
                {project.members.length > 3 && ` 他${project.members.length - 3}名`}
              </span>
            </div>
          )}

          {/* Client */}
          {project.client && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{project.client}</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {project.tech_stack.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            詳細を見る
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              <ExternalLink size={16} className="mr-1" />
              サイトを見る
            </a>
          )}
        </div>
      </div>
    </div>
  )
}