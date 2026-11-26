import React from 'react'
import { Play, Music, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { formatPlaylistDetails } from '../utils/formatters'
import Button from './common/Button'

export default function PlaylistCard({
  playlist,
  songs = [],
  isSelected = false,
  isPlaying = false,
  onSelect,
  onPlay,
  onRename,
  onDelete
}) {
  if (!playlist) return null

  // Calculate song count and total duration
  const playlistSongs = playlist.songIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)

  const songCount = playlistSongs.length
  const totalSeconds = playlistSongs.reduce((acc, song) => acc + (song.duration || 0), 0)
  const detailsText = formatPlaylistDetails(songCount, totalSeconds)

  // Multi-color mosaic or top song gradient
  const primaryGradient =
    playlistSongs[0]?.gradient || 'from-violet-600 via-indigo-600 to-purple-800'

  return (
    <div
      onClick={() => onSelect && onSelect(playlist)}
      className={`group relative flex flex-col p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isSelected
          ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-950/40'
          : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Artwork Thumbnail with quick play overlay */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-800 border border-slate-700/50">
        <div
          className={`w-full h-full bg-gradient-to-br ${primaryGradient} flex items-center justify-center p-3 relative`}
        >
          {/* Subtle decorative grid/overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg mb-1">
              <Music size={24} />
            </div>
            <span className="text-[11px] font-medium text-white/80 max-w-[120px] truncate">
              {playlist.name}
            </span>
          </div>

          {/* Quick Play Floating Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (songCount > 0 && onPlay) {
                onPlay(playlist)
              }
            }}
            disabled={songCount === 0}
            title={songCount === 0 ? 'Add songs first' : 'Play playlist'}
            aria-label="Play playlist"
            className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-900/50 flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-0"
          >
            <Play size={18} className="translate-x-0.5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-semibold text-sm truncate transition-colors ${
                isSelected ? 'text-indigo-400' : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {playlist.name}
            </h3>
            {isSelected && (
              <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse"></span>
            )}
          </div>

          {/* Detail string: e.g. "8 songs · 32 min" */}
          <p className="text-xs text-slate-400 font-mono mt-1">{detailsText}</p>
        </div>

        {/* Action icons (Rename & Delete) */}
        <div className="flex items-center justify-end gap-1 mt-3 pt-2.5 border-t border-slate-800/80">
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onRename && onRename(playlist)
            }}
            title="Rename playlist"
            className="text-slate-400 hover:text-slate-200 px-2 py-1"
            icon={<Edit2 size={13} />}
          >
            <span className="text-xs">Rename</span>
          </Button>

          <Button
            size="xs"
            variant="dangerGhost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete(playlist)
            }}
            title="Delete playlist"
            className="text-rose-400 hover:text-rose-300 px-2 py-1"
            icon={<Trash2 size={13} />}
          >
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
