import React from 'react'
import { Bell, Database, ExternalLink } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* PostgreSQL Database Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>PostgreSQL 18</span>
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline font-mono text-[11px] text-slate-300">API: 3333</span>
        </div>

        {/* GitHub Repository Quick Link */}
        <a
          href="https://github.com/r10ezz/PropertyOps"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          title="View GitHub Repository"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Notifications */}
        <button
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>
      </div>
    </header>
  )
}
