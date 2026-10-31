import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { PropertiesPage } from './pages/PropertiesPage'
import { UnitsPage } from './pages/UnitsPage'
import { Header } from './components/layout/Header'
import { Users, Wrench } from 'lucide-react'

// Placeholder for Phase 5 Modules
const ResidentsPlaceholder: React.FC = () => (
  <div>
    <Header
      title="Residents & Leases"
      subtitle="Resident Directory & Occupancy Contracts (Scheduled for Phase 5)"
    />
    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Resident Management Module</h2>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
        This module will feature tenant rosters, move-in/move-out workflows, lease agreement
        tracking, and resident portal access in Phase 5.
      </p>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
        Roadmap: Phase 5
      </span>
    </div>
  </div>
)

const MaintenancePlaceholder: React.FC = () => (
  <div>
    <Header
      title="Maintenance Requests"
      subtitle="Work Order Lifecycle & Priority Dispatch (Scheduled for Phase 5)"
    />
    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <Wrench className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Maintenance Workflow Engine</h2>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
        This module will feature an interactive Kanban pipeline (Open &rarr; In Progress &rarr; Resolved),
        priority tagging, and assignment to property maintenance staff in Phase 5.
      </p>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
        Roadmap: Phase 5
      </span>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/residents" element={<ResidentsPlaceholder />} />
            <Route path="/maintenance" element={<MaintenancePlaceholder />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
