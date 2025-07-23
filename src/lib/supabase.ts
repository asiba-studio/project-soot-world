
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)


// 画像アップロード関数
export async function uploadProjectImage(
    file: File,
    fileName: string
): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from('project-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Upload error:', error)
            return null
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(fileName)

        return urlData.publicUrl
    } catch (error) {
        console.error('Upload failed:', error)
        return null
    }
}

// 画像削除関数
export async function deleteProjectImage(fileName: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from('project-images')
            .remove([fileName])

        if (error) {
            console.error('Delete error:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Delete failed:', error)
        return false
    }
}

// 画像一覧取得
export async function listProjectImages(): Promise<string[]> {
    try {
        const { data, error } = await supabase.storage
            .from('project-images')
            .list()

        if (error) {
            console.error('List error:', error)
            return []
        }

        return data.map(file => file.name)
    } catch (error) {
        console.error('List failed:', error)
        return []
    }
}

// Supabase Storage URLを生成
export function getStorageUrl(fileName: string): string {
    const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

    return data.publicUrl
}

// ファイル名からStorageのパスを取得（URL→ファイル名）
export function getFileNameFromUrl(url: string): string | null {
    const match = url.match(/\/project-images\/(.+)$/)
    return match ? match[1] : null
}