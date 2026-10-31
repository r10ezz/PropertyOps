import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  label?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}
