// src/lib/types.ts

// Supabase Database型定義
export interface Database {
    public: {
      Tables: {
        players: {
          Row: Player
          Insert: PlayerInsert
          Update: PlayerUpdate
        }
        projects: {
          Row: Project
          Insert: ProjectInsert
          Update: ProjectUpdate
        }
        project_members: {
          Row: ProjectMember
          Insert: ProjectMemberInsert
          Update: ProjectMemberUpdate
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        [_ in never]: never
      }
    }
  }
  
  // Player型定義
  export interface Player {
    id: string
    name: string
    name_eng: string | null
    avatar: string | null
    affiliation: string | null
    role: string
    social_links: SocialLinks
    created_at: string
    updated_at: string
  }
  
  export interface PlayerInsert {
    id?: string
    name: string
    name_eng?: string | null
    avatar?: string | null
    affiliation?: string | null
    role: string
    social_links?: SocialLinks
    created_at?: string
    updated_at?: string
  }
  
  export interface PlayerUpdate {
    name?: string
    name_eng?: string | null
    avatar?: string | null
    affiliation?: string | null
    role?: string
    social_links?: SocialLinks
    updated_at?: string
  }
  
  // Project型定義
  export interface Project {
    id: string
    title: string
    subtitle: string | null
    description: string | null
    url: string | null
    cover: string | null
    photos: string[] | null
    category: string
    status: string
    client: string | null
    start_date: string
    end_date: string | null
    tech_stack: string[]
    keywords: string[]
    location: Location | null
    display_position: DisplayPosition | null
    created_at: string
    updated_at: string
  }
  
  export interface ProjectInsert {
    id?: string
    title: string
    subtitle?: string | null
    description?: string | null
    url?: string | null
    cover?: string | null
    photos?: string[] | null
    category: string
    status: string
    client?: string | null
    start_date: string
    end_date?: string | null
    tech_stack?: string[]
    keywords?: string[]
    location?: Location | null
    display_position?: DisplayPosition | null
    created_at?: string
    updated_at?: string
  }
  
  export interface ProjectUpdate {
    title?: string
    subtitle?: string | null
    description?: string | null
    url?: string | null
    cover?: string | null
    photos?: string[] | null
    category?: string
    status?: string
    client?: string | null
    start_date?: string
    end_date?: string | null
    tech_stack?: string[]
    keywords?: string[]
    location?: Location | null
    display_position?: DisplayPosition | null
    updated_at?: string
  }
  
  // ProjectMember型定義
  export interface ProjectMember {
    id: string
    project_id: string
    player_id: string
    role_in_project: string | null
    created_at: string
  }
  
  export interface ProjectMemberInsert {
    id?: string
    project_id: string
    player_id: string
    role_in_project?: string | null
    created_at?: string
  }
  
  export interface ProjectMemberUpdate {
    project_id?: string
    player_id?: string
    role_in_project?: string | null
  }
  
  // 補助型定義
  export interface SocialLinks {
    x?: string
    instagram?: string
    discord?: string
    spotify?: string
  }
  
  export interface Location {
    lat: number
    lng: number
  }
  
  export interface DisplayPosition {
    x: number
    y: number
    z: number
  }
  
  // プロジェクトメンバー情報付きのProject型
  export interface ProjectWithMembers extends Project {
    members: Array<{
      player: Player
      role_in_project: string | null
    }>
  }
  
  // カテゴリとステータスの定数
  export const PROJECT_CATEGORIES = [
    'スタジオ案件',
    'ワークショップ案件',
    'トークセッション登壇',
    'インキュベーション参加者によるプロジェクト'
  ] as const
  
  export const PROJECT_STATUSES = [
    '企画中',
    '進行中',
    '完了',
    '中止'
  ] as const
  
  export const PLAYER_ROLES = [
    'Creative Director',
    'UX Designer',
    'Frontend Engineer',
    'Backend Engineer',
    'Product Manager',
    'Workshop Facilitator'
  ] as const
  
  export type ProjectCategory = typeof PROJECT_CATEGORIES[number]
  export type ProjectStatus = typeof PROJECT_STATUSES[number]
  export type PlayerRole = typeof PLAYER_ROLES[number]