import React from 'react'

const GENRE_COLORS = {
  Synthwave: 'bg-fuchsia-950/40 text-fuchsia-300 border-fuchsia-500/20',
  'Lo-Fi': 'bg-amber-950/40 text-amber-300 border-amber-500/20',
  Electronic: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/20',
  'R&B': 'bg-rose-950/40 text-rose-300 border-rose-500/20',
  Indie: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20',
  Pop: 'bg-violet-950/40 text-violet-300 border-violet-500/20',
  Jazz: 'bg-blue-950/40 text-blue-300 border-blue-500/20',
  Rock: 'bg-red-950/40 text-red-300 border-red-500/20',
  Ambient: 'bg-teal-950/40 text-teal-300 border-teal-500/20',
  Classical: 'bg-sky-950/40 text-sky-300 border-sky-500/20'
}

export default function Badge({
  genre,
  size = 'sm',
  className = ''
}) {
  const colorClass = GENRE_COLORS[genre] || 'bg-[#282828] text-[#b3b3b3] border-white/5'
  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide uppercase ${sizeClass} ${colorClass} ${className}`}
    >
      {genre}
    </span>
  )
}
