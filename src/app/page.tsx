// src/app/page.tsx
import Layout from '@/components/Layout'
import ProjectsSection from '@/components/ProjectSection'

export default function HomePage() {
  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="sr-only">
            Project Visualizer
          </h1>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="sr-only">
            Projects
          </h2>
          <ProjectsSection />
        </div>
      </div>
    </Layout>
  )
}
