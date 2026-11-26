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

  const rowGradient = song.gradient || 'from-violet-600 to-indigo-600'

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center justify-between p-3 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 border ${
        isCurrentSong
          ? 'bg-indigo-950/40 border-indigo-500/40 shadow-md shadow-indigo-950/50'
          : 'bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700/80'
      } ${isDragOver ? 'border-t-2 border-t-indigo-400 bg-indigo-900/20' : ''}`}
    >
      {/* Left section: drag handle (if playlist) + index / play button + artwork + title & artist */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 mr-2">
        {/* Drag handle on playlist mode */}
        {mode === 'playlist' && (
          <div
            className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors"
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
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isCurrentSong && isPlaying
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                : 'text-slate-400 group-hover:text-white group-hover:bg-slate-800/90'
            }`}
            title={isCurrentSong && isPlaying ? 'Pause' : 'Play song'}
            aria-label={isCurrentSong && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isCurrentSong && isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-white rounded-full animate-wave-1"></span>
                <span className="w-0.5 bg-white rounded-full animate-wave-2"></span>
                <span className="w-0.5 bg-white rounded-full animate-wave-3"></span>
              </div>
            ) : (
              <>
                <span className="block group-hover:hidden text-xs font-mono text-slate-500 font-semibold">
                  {typeof index === 'number' ? String(index + 1).padStart(2, '0') : ''}
                </span>
                <Play size={15} className="hidden group-hover:block translate-x-0.5" />
              </>
            )}
          </button>
        </div>

        {/* Song artwork gradient preview */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rowGradient} flex-shrink-0 flex items-center justify-center text-white/90 shadow-sm border border-white/10`}
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
              className={`text-sm font-semibold truncate cursor-pointer transition-colors ${
                isCurrentSong ? 'text-indigo-400' : 'text-slate-100 hover:text-white'
              }`}
            >
              {song.title}
            </h4>
            {/* Small active badge on mobile */}
            {isCurrentSong && (
              <span className="inline-block sm:hidden w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
            <span className="truncate">{song.artist}</span>
            {song.album && (
              <span className="hidden md:inline text-slate-600 truncate">• {song.album}</span>
            )}
            <span className="sm:hidden text-slate-600">•</span>
            <span className="sm:hidden text-slate-400 font-mono">
              {formatDuration(song.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: Genre badge (hidden on tiny screens) */}
      <div className="hidden sm:flex items-center justify-center w-28 px-2 flex-shrink-0">
        <Badge genre={song.genre} size="xs" />
      </div>

      {/* Right section: Duration + Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <span className="hidden sm:inline text-xs font-mono text-slate-400 w-12 text-right">
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
            icon={isAddedToActivePlaylist ? <Check size={13} className="text-emerald-400" /> : <Plus size={14} />}
            className="text-xs font-normal"
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
              onClick={() => onMoveUp && onMoveUp(index)}
              disabled={!canMoveUp}
              title="Move Up"
              aria-label="Move Up"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp size={16} />
            </button>

            {/* Move Down Button */}
            <button
              type="button"
              onClick={() => onMoveDown && onMoveDown(index)}
              disabled={!canMoveDown}
              title="Move Down"
              aria-label="Move Down"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown size={16} />
            </button>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove && onRemove(song.id)}
              title="Remove from playlist"
              aria-label="Remove from playlist"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-0.5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
