import Layout from '../components/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to ERP System</h2>
        <p className="text-gray-600">
          Select a module from the sidebar to get started.
        </p>
      </div>
    </Layout>
  )
} 