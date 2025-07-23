// src/app/projects/page.tsx
import Layout from '@/components/Layout'
import ProjectsList from '@/components/ProjectsList'

export default function ProjectsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            全プロジェクト
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            新規プロジェクト
          </button>
        </div>
        <ProjectsList />
      </div>
    </Layout>
  )
}