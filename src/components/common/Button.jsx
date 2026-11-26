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
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs rounded-full gap-1',
    sm: 'px-3.5 py-1.5 text-xs rounded-full gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-full gap-2',
    lg: 'px-7 py-3.5 text-base rounded-full gap-2.5',
    iconSm: 'p-1.5 rounded-full text-xs',
    iconMd: 'p-2 rounded-full text-sm',
    iconLg: 'p-3 rounded-full text-base'
  }

  const variantStyles = {
    // Spotify iconic vibrant green pill button
    primary: 'bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 text-black font-bold shadow-lg shadow-[#1ed760]/20 focus:ring-[#1ed760] border-0',
    secondary: 'bg-[#242424] hover:bg-[#2a2a2a] text-white border border-white/10 focus:ring-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-[#b3b3b3] hover:text-white focus:ring-white/20',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 focus:ring-rose-500 border border-rose-500/30',
    dangerGhost: 'bg-transparent hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 focus:ring-rose-500',
    outline: 'bg-transparent border border-[#727272] text-white hover:border-white hover:bg-white/5 focus:ring-white/20',
    success: 'bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold shadow-lg shadow-[#1ed760]/20 focus:ring-[#1ed760]'
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
