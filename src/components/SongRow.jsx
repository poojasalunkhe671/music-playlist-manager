import React, { useState } from 'react'
import { Play, Pause, Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Check } from 'lucide-react'
import { formatDuration } from '../utils/formatters'
import Badge from './common/Badge'
import Button from './common/Button'

export default function SongRow({
  song,
  index,
  isCurrentSong = false,
  isPlaying = false,
  onPlay,
  mode = 'library', // 'library' | 'playlist'
  onAddToPlaylist,
  isAddedToActivePlaylist = false,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isDraggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver = false
}) {
  const [imageError, setImageError] = useState(false)

  if (!song) return null

  const rowGradient = song.gradient || 'from-emerald-700 to-teal-900'

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center justify-between p-1.5 sm:px-4 sm:py-2.5 rounded-lg transition-colors ${
        isCurrentSong
          ? 'bg-[#282828] text-[#1ed760]'
          : 'hover:bg-[#2a2a2a]/60 text-white'
      } ${isDragOver ? 'border-t-2 border-t-[#1ed760] bg-[#1ed760]/10' : ''}`}
    >
      {/* Left section: drag handle + index / play button + cover image + title & artist */}
      <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0 flex-1 mr-1.5">
        {/* Drag handle */}
        {isDraggable && (
          <div
            className="text-[#727272] hover:text-white cursor-grab active:cursor-grabbing p-0.5 sm:p-1 -ml-0.5 transition-colors flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical size={14} className="sm:hidden" />
            <GripVertical size={16} className="hidden sm:block" />
          </div>
        )}

        {/* Index or Play icon */}
        <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onPlay) onPlay(song)
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all text-[#b3b3b3] group-hover:text-white"
            title={isCurrentSong && isPlaying ? 'Pause' : 'Play song'}
            aria-label={isCurrentSong && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isCurrentSong && isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-1"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-2"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-3"></span>
              </div>
            ) : (
              <>
                <span
                  className={`block group-hover:hidden text-[11px] sm:text-xs font-mono font-medium ${
                    isCurrentSong ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
                  }`}
                >
                  {typeof index === 'number' ? String(index + 1).padStart(2, '0') : ''}
                </span>
                <Play size={13} className="hidden group-hover:block translate-x-0.5" fill="currentColor" />
              </>
            )}
          </button>
        </div>

        {/* Music Album Cover Image */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-md overflow-hidden bg-[#282828] flex-shrink-0 relative shadow-sm border border-white/5">
          {song.coverUrl && !imageError ? (
            <img
              src={song.coverUrl}
              alt={song.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${rowGradient} flex items-center justify-center text-white/90`}
            >
              <span className="text-[10px] sm:text-xs font-bold tracking-tight">
                {song.title?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Title, Artist, and Duration */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4
              onClick={(e) => {
                e.stopPropagation()
                if (onPlay) onPlay(song)
              }}
              className={`text-xs sm:text-sm font-medium truncate cursor-pointer hover:underline transition-colors ${
                isCurrentSong ? 'text-[#1ed760] font-semibold' : 'text-white'
              }`}
            >
              {song.title}
            </h4>
            {isCurrentSong && (
              <span className="inline-block sm:hidden w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse"></span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#b3b3b3] mt-0.5 truncate">
            <span className="truncate hover:text-white hover:underline cursor-pointer">{song.artist}</span>
            {song.album && (
              <span className="hidden md:inline text-[#727272] truncate">• {song.album}</span>
            )}
            <span className="sm:hidden text-[#727272]">•</span>
            <span className="sm:hidden text-[#b3b3b3] font-mono">
              {formatDuration(song.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: Genre badge (Hidden on mobile) */}
      <div className="hidden md:flex items-center justify-center w-24 px-1 flex-shrink-0">
        <Badge genre={song.genre} size="xs" />
      </div>

      {/* Right section: Duration + Reorder (Up/Down) + Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <span className="hidden sm:inline text-xs font-mono text-[#b3b3b3] w-12 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* Move Up / Down Buttons */}
        {(onMoveUp || onMoveDown) && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (canMoveUp && onMoveUp) onMoveUp(index)
              }}
              disabled={!canMoveUp}
              title="Move Up"
              aria-label="Move Up"
              className="p-1 sm:p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp size={15} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (canMoveDown && onMoveDown) onMoveDown(index)
              }}
              disabled={!canMoveDown}
              title="Move Down"
              aria-label="Move Down"
              className="p-1 sm:p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown size={15} />
            </button>
          </div>
        )}

        {/* Mode: Library actions (Add to Playlist button) */}
        {mode === 'library' && (
          <Button
            size="xs"
            variant={isAddedToActivePlaylist ? 'secondary' : 'primary'}
            onClick={(e) => {
              e.stopPropagation()
              if (onAddToPlaylist) onAddToPlaylist(song)
            }}
            title={
              isAddedToActivePlaylist
                ? 'Already in selected playlist'
                : 'Add to playlist'
            }
            icon={isAddedToActivePlaylist ? <Check size={12} className="text-[#1ed760]" /> : <Plus size={13} />}
            className="p-1 sm:px-2.5 sm:py-1 text-xs font-semibold"
          >
            <span className="hidden sm:inline">
              {isAddedToActivePlaylist ? 'Added' : 'Add'}
            </span>
          </Button>
        )}

        {/* Mode: Playlist actions (Remove button) */}
        {mode === 'playlist' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onRemove) onRemove(song.id)
            }}
            title="Remove from playlist"
            aria-label="Remove from playlist"
            className="p-1 sm:p-1.5 rounded-full text-[#b3b3b3] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
