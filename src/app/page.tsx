// src/app/page.tsx
import Layout from '@/components/Layout'
import ProjectWorld from '@/components/ProjectWorld'
import ProjectsList from '@/components/ProjectList'

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="sr-only">
            Project Visualizer
          </h1>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="sr-only">
            最近のプロジェクトaa
          </h2>
            <ProjectWorld />
            {/*<ProjectsList limit={6} />*/}
        </div>
      </div>
    </Layout>
  )
}

