// src/hooks/useProjects.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectWithMembers, Player } from '@/lib/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProjects()
  }

  return { projects, loading, error, refetch }
}

export function useProjectsWithMembers() {
  const [projects, setProjects] = useState<ProjectWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjectsWithMembers()
  }, [])

  const fetchProjectsWithMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            role_in_project,
            player:players (*)
          )
        `)
        .order('start_date', { ascending: false })

      if (error) throw error

      const projectsWithMembers: ProjectWithMembers[] = (data || []).map(project => ({
        ...project,
        members: project.project_members?.map((pm: any) => ({
          player: pm.player,
          role_in_project: pm.role_in_project
        })) || []
      }))

      setProjects(projectsWithMembers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProjectsWithMembers()
  }

  return { projects, loading, error, refetch }
}

export function useProject(id: string) {
  const [project, setProject] = useState<ProjectWithMembers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProject(id)
    }
  }, [id])

  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            role_in_project,
            player:players (*)
          )
        `)
        .eq('id', projectId)
        .single()

      if (error) throw error

      const projectWithMembers: ProjectWithMembers = {
        ...data,
        members: data.project_members?.map((pm: any) => ({
          player: pm.player,
          role_in_project: pm.role_in_project
        })) || []
      }

      setProject(projectWithMembers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    if (id) {
      fetchProject(id)
    }
  }

  return { project, loading, error, refetch }
}