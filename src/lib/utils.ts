// src/lib/utils.ts
import clsx, { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'スタジオ案件': 'bg-blue-100 text-blue-800',
    'ワークショップ案件': 'bg-green-100 text-green-800',
    'トークセッション登壇': 'bg-purple-100 text-purple-800',
    'インキュベーション参加者によるプロジェクト': 'bg-orange-100 text-orange-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    '企画中': 'bg-yellow-100 text-yellow-800',
    '進行中': 'bg-blue-100 text-blue-800',
    '完了': 'bg-green-100 text-green-800',
    '中止': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateRange(startDate: string, endDate?: string | null): string {
  const start = formatDate(startDate)
  if (!endDate) return start
  const end = formatDate(endDate)
  return `${start} 〜 ${end}`
}