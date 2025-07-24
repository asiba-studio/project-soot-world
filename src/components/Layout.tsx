// src/components/Layout.tsx
import React from 'react'
import Link from 'next/link'
import { Home, Grid3x3, Map, Users, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-300">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Project Visualizer
              </Link>
            </div>
            <nav className="flex space-x-8">
              <NavLink href="/" icon={<Home size={18} />}>
                ホーム
              </NavLink>
              <NavLink href="/projects" icon={<Grid3x3 size={18} />}>
                プロジェクト
              </NavLink>
              <NavLink href="/visualize" icon={<Map size={18} />}>
                可視化
              </NavLink>
              <NavLink href="/players" icon={<Users size={18} />}>
                メンバー
              </NavLink>
              <NavLink href="/settings" icon={<Settings size={18} />}>
                設定
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}