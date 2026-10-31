import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  Wrench,
  Shield,
  LogOut,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface NavItem {
  name: string
  to: string
  icon: React.ElementType
  badge?: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Properties', to: '/properties', icon: Building2 },
  { name: 'Units', to: '/units', icon: Home },
  { name: 'Residents', to: '/residents', icon: Users, badge: 'Phase 5' },
  { name: 'Maintenance', to: '/maintenance', icon: Wrench, badge: 'Phase 5' },
]

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()

  const getInitials = (name?: string | null) => {
    if (!name) return 'PO'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const organizationName = user?.organization?.name || 'Skyline Living Residences'

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">PropertyOps</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide">
              ENTERPRISE SAAS
            </span>
          </div>
        </div>
      </div>

      {/* Tenant Organization Switcher Preview */}
      <div className="px-4 py-3 mx-3 my-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {organizationName}
            </div>
            <div className="text-[10px] text-slate-400">
              Org #{user?.organizationId || 1} &bull; Active Tenant
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-2 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
            {getInitials(user?.fullName)}
          </div>
          <div className="text-left truncate">
            <div className="text-xs font-semibold text-white truncate">
              {user?.fullName || 'User'}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 capitalize">
              {user?.role === 'admin' ? (
                <Shield className="w-3 h-3 text-brand-400 shrink-0" />
              ) : (
                <UserCheck className="w-3 h-3 text-indigo-400 shrink-0" />
              )}
              <span>{user?.role?.replace('_', ' ') || 'Staff'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
