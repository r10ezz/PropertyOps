import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Database,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Authentication failed. Please check your credentials.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setSubmitting(true)
    setError(null)

    try {
      await login({ email: demoEmail, password: demoPass })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Authentication failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 items-center justify-center shadow-lg shadow-brand-500/30 mb-2">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to PropertyOps
          </h1>
          <p className="text-xs text-slate-400">
            Multi-Tenant Property Management SaaS &bull; Organization Scoped
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@propertyops.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons for Interviewers */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Demo Logins
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Preset 1: Admin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@propertyops.com', 'password123')}
                disabled={submitting}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 text-left transition group disabled:opacity-50"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-brand-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-white">Admin Role</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Alex Morgan</div>
                <div className="text-[9px] text-brand-400 font-mono mt-0.5">Full CRUD + Delete</div>
              </button>

              {/* Preset 2: Property Manager */}
              <button
                type="button"
                onClick={() => handleQuickLogin('manager@propertyops.com', 'password123')}
                disabled={submitting}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition group disabled:opacity-50"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <UserCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-white">Manager Role</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Sarah Jenkins</div>
                <div className="text-[9px] text-indigo-400 font-mono mt-0.5">Operational CRUD</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Technical Metadata */}
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>PostgreSQL 18</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AdonisJS Access Tokens</span>
          </span>
        </div>
      </div>
    </div>
  )
}
