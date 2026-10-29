import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Building2,
  Home,
  Users,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Database,
  Server,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

interface BackendStatus {
  app: string
  status: string
  version: string
  database: string
  environment: string
  timestamp: string
}

export default function App() {
  const [backendData, setBackendData] = useState<BackendStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkBackend = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<BackendStatus>('http://localhost:3333/')
      setBackendData(res.data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not connect to AdonisJS backend')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">PropertyOps</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-medium border border-brand-500/20">
                  Phase 1 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Multi-Tenant Property Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    backendData ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendData ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span>
                {loading
                  ? 'Connecting...'
                  : backendData
                  ? 'API Live (Port 3333)'
                  : 'Backend Offline'}
              </span>
            </div>
            <button
              onClick={checkBackend}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Ping Backend API"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Live System Health Banner */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-1">
                <Server className="w-3.5 h-3.5" />
                <span>Full-Stack Environment Status</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                PropertyOps Platform is Live on Localhost
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                React 19 + TypeScript frontend is rendering on port <code>5173</code> and
                communicating with the AdonisJS v6 + PostgreSQL engine on port <code>3333</code>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5">
                <Database className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Database</div>
                  <div className="text-xs font-medium text-slate-200">PostgreSQL (18.3)</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Multi-Tenancy</div>
                  <div className="text-xs font-medium text-slate-200">Organization Scoped</div>
                </div>
              </div>
            </div>
          </div>

          {/* Backend Response Feed */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {backendData ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                Live Handshake Response (GET http://localhost:3333/)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {backendData?.timestamp || 'Polling...'}
              </span>
            </div>

            {loading ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-sm text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
                <span>Pinging AdonisJS backend server...</span>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 text-sm text-rose-300">
                <p className="font-semibold">Backend Unreachable:</p>
                <p className="text-xs text-rose-400 mt-1">{error}</p>
              </div>
            ) : (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner">
                {JSON.stringify(backendData, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* SaaS Dashboard Feature Preview Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              <span>Core Operational Modules (Upcoming in Phases 2–5)</span>
            </h2>
            <span className="text-xs text-slate-400">Production Portfolio Specification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Properties */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Properties</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-building tracking, address details, and occupancy rollups.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Phase 2 CRUD</span>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition" />
              </div>
            </div>

            {/* Card 2: Units */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Units & Rent</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Square footage, bed/bath specs, rent tracking, vacant/occupied states.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Phase 2 Schema</span>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
              </div>
            </div>

            {/* Card 3: Residents */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Residents & Leases</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Occupant directory, lease dates, emergency contacts, resident logins.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Phase 5 Workflow</span>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition" />
              </div>
            </div>

            {/* Card 4: Maintenance */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Maintenance Tickets</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Priority dispatch, assignment to staff, Open/In Progress/Resolved lifecycle.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Phase 5 Pipeline</span>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Next Steps */}
        <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Next Step: Phase 2 Execution</div>
              <p className="text-xs text-slate-400">
                We will create the Organizations, Properties, and Units database migrations,
                models, seeders, and REST endpoints.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            git branch: main (synced)
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950">
        PropertyOps SaaS &bull; Full-Stack React + AdonisJS + PostgreSQL Architecture
      </footer>
    </div>
  )
}
