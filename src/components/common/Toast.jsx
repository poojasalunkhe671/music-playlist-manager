import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null

  const icons = {
    success: <CheckCircle2 className="text-emerald-400" size={18} />,
    error: <AlertCircle className="text-rose-400" size={18} />,
    info: <Info className="text-indigo-400" size={18} />
  }

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/80',
    error: 'border-rose-500/30 bg-rose-950/80',
    info: 'border-indigo-500/30 bg-indigo-950/80'
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-sm w-full transition-all duration-300 animate-slideUp">
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-xl text-slate-100 ${
          borderColors[toast.type] || borderColors.info
        }`}
      >
        <div className="flex items-center gap-2.5">
          {icons[toast.type] || icons.info}
          <p className="text-xs font-medium">{toast.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss message"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
