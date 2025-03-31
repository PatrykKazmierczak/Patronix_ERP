import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import BillOfMaterials from './pages/BillOfMaterials'

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Placeholder component for modules
const ModulePage = ({ title }: { title: string }) => (
  <Layout>
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600">
        This is the {title} module. Content coming soon.
      </p>
    </div>
  </Layout>
)

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Engineering Module Routes */}
        <Route
          path="/engineering/product-design"
          element={
            <ProtectedRoute>
              <ModulePage title="Product Design" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineering/bom"
          element={
            <ProtectedRoute>
              <BillOfMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineering/change-management"
          element={
            <ProtectedRoute>
              <ModulePage title="Change Management" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineering/documentation"
          element={
            <ProtectedRoute>
              <ModulePage title="Technical Documentation" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/engineering/research"
          element={
            <ProtectedRoute>
              <ModulePage title="Research & Development" />
            </ProtectedRoute>
          }
        />
        {/* Sales Module Routes */}
        <Route
          path="/sales/customer-360"
          element={
            <ProtectedRoute>
              <ModulePage title="Customer 360" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/orders"
          element={
            <ProtectedRoute>
              <ModulePage title="Sales Orders" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/order-intake"
          element={
            <ProtectedRoute>
              <ModulePage title="Order Intake Workbench" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/order-fulfillment"
          element={
            <ProtectedRoute>
              <ModulePage title="Order Fulfillment Workbench" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/inventory"
          element={
            <ProtectedRoute>
              <ModulePage title="Inventory / Commitments" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/parameters"
          element={
            <ProtectedRoute>
              <ModulePage title="Sales Parameters" />
            </ProtectedRoute>
          }
        />
        {/* Other Module Routes */}
        <Route
          path="/master-data"
          element={
            <ProtectedRoute>
              <ModulePage title="Master Data" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning"
          element={
            <ProtectedRoute>
              <ModulePage title="Planning" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturing"
          element={
            <ProtectedRoute>
              <ModulePage title="Manufacturing" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/procurement"
          element={
            <ProtectedRoute>
              <ModulePage title="Procurement" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehousing"
          element={
            <ProtectedRoute>
              <ModulePage title="Warehousing" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financials"
          element={
            <ProtectedRoute>
              <ModulePage title="Financials" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoicing"
          element={
            <ProtectedRoute>
              <ModulePage title="Invoicing" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/common"
          element={
            <ProtectedRoute>
              <ModulePage title="Common" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/localization"
          element={
            <ProtectedRoute>
              <ModulePage title="Localization" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enterprise-modeler"
          element={
            <ProtectedRoute>
              <ModulePage title="Enterprise Modeler" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <ModulePage title="Tools" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/e-devlet"
          element={
            <ProtectedRoute>
              <ModulePage title="E-Devlet" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/options"
          element={
            <ProtectedRoute>
              <ModulePage title="Options" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  )
}

export default App 