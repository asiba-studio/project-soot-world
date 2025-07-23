// src/app/page.tsx
import Layout from '@/components/Layout'
import ProjectsList from '@/components/ProjectList'

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            デザインスタジオのプロジェクトを可視化し、
            創造的な体験とインサイトを提供します
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="総プロジェクト数" value="6" color="blue" />
          <StatCard title="進行中" value="2" color="orange" />
          <StatCard title="完了" value="3" color="green" />
          <StatCard title="メンバー数" value="6" color="purple" />
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            最近のプロジェクト
          </h2>
          <ProjectsList limit={6} />
        </div>
      </div>
    </Layout>
  )
}

interface StatCardProps {
  title: string
  value: string
  color: 'blue' | 'green' | 'orange' | 'purple'
}

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  }

  return (
    <div className={`${colorClasses[color]} p-6 rounded-lg`}>
      <h3 className="text-sm font-medium opacity-75">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

