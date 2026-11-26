import React from 'react'

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon = null,
  title = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f19] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs rounded-md gap-1',
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
    iconSm: 'p-1.5 rounded-lg text-xs',
    iconMd: 'p-2 rounded-xl text-sm',
    iconLg: 'p-3 rounded-2xl text-base'
  }

  const variantStyles = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 focus:ring-violet-500 border border-violet-400/20',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 focus:ring-slate-500 hover:border-slate-600',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-500',
    danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 focus:ring-rose-500 border border-rose-500/30',
    dangerGhost: 'bg-transparent hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 focus:ring-rose-500',
    outline: 'bg-transparent border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 focus:ring-indigo-500',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 focus:ring-emerald-500 border border-emerald-400/20'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
