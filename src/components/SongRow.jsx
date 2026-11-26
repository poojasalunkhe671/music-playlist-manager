import React from 'react'
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
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver = false
}) {
  if (!song) return null

  const rowGradient = song.gradient || 'from-emerald-700 to-teal-900'

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center justify-between p-2.5 sm:px-4 sm:py-2.5 rounded-lg transition-colors ${
        isCurrentSong
          ? 'bg-[#282828] text-[#1ed760]'
          : 'hover:bg-[#2a2a2a]/60 text-white'
      } ${isDragOver ? 'border-t-2 border-t-[#1ed760] bg-[#1ed760]/10' : ''}`}
    >
      {/* Left section: drag handle (if playlist) + index / play button + artwork + title & artist */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 mr-2">
        {/* Drag handle on playlist mode */}
        {mode === 'playlist' && (
          <div
            className="text-[#727272] hover:text-white cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
        )}

        {/* Index or Play icon */}
        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onPlay && onPlay(song)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all text-[#b3b3b3] group-hover:text-white"
            title={isCurrentSong && isPlaying ? 'Pause' : 'Play song'}
            aria-label={isCurrentSong && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isCurrentSong && isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-1"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-2"></span>
                <span className="w-0.5 bg-[#1ed760] rounded-full animate-wave-3"></span>
              </div>
            ) : (
              <>
                <span
                  className={`block group-hover:hidden text-xs font-mono font-medium ${
                    isCurrentSong ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
                  }`}
                >
                  {typeof index === 'number' ? String(index + 1).padStart(2, '0') : ''}
                </span>
                <Play size={15} className="hidden group-hover:block translate-x-0.5" fill="currentColor" />
              </>
            )}
          </button>
        </div>

        {/* Song artwork gradient preview */}
        <div
          className={`w-10 h-10 rounded-md bg-gradient-to-br ${rowGradient} flex-shrink-0 flex items-center justify-center text-white/90 shadow-sm border border-white/5`}
        >
          <span className="text-xs font-bold tracking-tight">
            {song.title?.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Title, Artist, and Mobile Genre/Duration */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onPlay && onPlay(song)}
              className={`text-sm font-medium truncate cursor-pointer hover:underline transition-colors ${
                isCurrentSong ? 'text-[#1ed760] font-semibold' : 'text-white'
              }`}
            >
              {song.title}
            </h4>
            {isCurrentSong && (
              <span className="inline-block sm:hidden w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse"></span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#b3b3b3] mt-0.5 truncate">
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

      {/* Middle section: Genre badge */}
      <div className="hidden sm:flex items-center justify-center w-28 px-2 flex-shrink-0">
        <Badge genre={song.genre} size="xs" />
      </div>

      {/* Right section: Duration + Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <span className="hidden sm:inline text-xs font-mono text-[#b3b3b3] w-12 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* Mode: Library actions (Add to Playlist button) */}
        {mode === 'library' && (
          <Button
            size="xs"
            variant={isAddedToActivePlaylist ? 'secondary' : 'primary'}
            onClick={() => onAddToPlaylist && onAddToPlaylist(song)}
            title={
              isAddedToActivePlaylist
                ? 'Already in selected playlist'
                : 'Add to playlist'
            }
            icon={isAddedToActivePlaylist ? <Check size={13} className="text-[#1ed760]" /> : <Plus size={14} />}
            className="text-xs font-semibold"
          >
            <span className="hidden md:inline">
              {isAddedToActivePlaylist ? 'Added' : 'Add'}
            </span>
          </Button>
        )}

        {/* Mode: Playlist actions (Move Up / Down buttons + Remove) */}
        {mode === 'playlist' && (
          <div className="flex items-center gap-1">
            {/* Move Up Button */}
            <button
              type="button"
              onClick={() => handleMoveUp ? onMoveUp(index) : null}
              disabled={!canMoveUp}
              title="Move Up"
              aria-label="Move Up"
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp size={16} />
            </button>

            {/* Move Down Button */}
            <button
              type="button"
              onClick={() => handleMoveDown ? onMoveDown(index) : null}
              disabled={!canMoveDown}
              title="Move Down"
              aria-label="Move Down"
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown size={16} />
            </button>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove && onRemove(song.id)}
              title="Remove from playlist"
              aria-label="Remove from playlist"
              className="p-1.5 rounded-full text-[#b3b3b3] hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-0.5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
