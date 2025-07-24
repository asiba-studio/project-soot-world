
'use client'
import React, { useState } from 'react'
import { useProjectsWithMembers } from '@/hook/useProjects'
import ProjectCard from '@/components/ProjectCard'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/types'


interface ProjectWorldProps {
    limit?: number
    
}




export default function ProjectWorld({ limit }: ProjectWorldProps) {
    const { projects, loading, error } = useProjectsWithMembers()

    if (loading) {
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

    console.log(filteredProjects)





    return (
        <div className="space-y-6">
            {/* Filters */}
            aaaaaaa
        </div>
    )
}