import React from 'react'

interface BadgeProps {
  variant?: 'occupied' | 'vacant' | 'maintenance' | 'residential' | 'commercial' | 'mixed' | 'default'
  children: React.ReactNode
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  const variantStyles = {
    occupied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    vacant: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    residential: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    commercial: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    mixed: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border capitalize ${sizeClasses} ${variantStyles[variant]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          variant === 'occupied'
            ? 'bg-emerald-400'
            : variant === 'vacant'
            ? 'bg-sky-400'
            : variant === 'maintenance'
            ? 'bg-amber-400'
            : variant === 'residential'
            ? 'bg-indigo-400'
            : variant === 'commercial'
            ? 'bg-purple-400'
            : variant === 'mixed'
            ? 'bg-cyan-400'
            : 'bg-slate-400'
        }`}
      />
      {children}
    </span>
  )
}
