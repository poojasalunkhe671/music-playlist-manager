import React from 'react'

const GENRE_COLORS = {
  Synthwave: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-700/40',
  'Lo-Fi': 'bg-amber-950/60 text-amber-300 border-amber-700/40',
  Electronic: 'bg-cyan-950/60 text-cyan-300 border-cyan-700/40',
  'R&B': 'bg-rose-950/60 text-rose-300 border-rose-700/40',
  Indie: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40',
  Pop: 'bg-violet-950/60 text-violet-300 border-violet-700/40',
  Jazz: 'bg-indigo-950/60 text-indigo-300 border-indigo-700/40',
  Rock: 'bg-red-950/60 text-red-300 border-red-700/40',
  Ambient: 'bg-teal-950/60 text-teal-300 border-teal-700/40',
  Classical: 'bg-sky-950/60 text-sky-300 border-sky-700/40'
}

export default function Badge({
  genre,
  size = 'sm',
  className = ''
}) {
  const colorClass = GENRE_COLORS[genre] || 'bg-slate-800 text-slate-300 border-slate-700'
  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide uppercase ${sizeClass} ${colorClass} ${className}`}
    >
      {genre}
    </span>
  )
}
