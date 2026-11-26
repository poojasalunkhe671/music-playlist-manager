import React from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music
} from 'lucide-react'
import { formatDuration } from '../utils/formatters'
import Badge from './common/Badge'

export default function PlayerBar({
  currentSong,
  isPlaying,
  currentTime,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat
}) {
  if (!currentSong) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c101d]/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-600">
              <Music size={16} />
            </div>
            <span>No song selected. Choose a song to start listening.</span>
          </div>
          <span className="hidden sm:inline text-slate-600 font-mono">00:00 / 00:00</span>
        </div>
      </footer>
    )
  }

  const duration = currentSong.duration || 180
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100))
  const artworkGradient = currentSong.gradient || 'from-indigo-600 to-violet-600'

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = Math.floor(newPercent * duration)
    if (onSeek) onSeek(newTime)
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c101d]/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl transition-all">
      {/* Top micro progress bar for mobile and desktop */}
      <div
        onClick={handleScrubberClick}
        className="w-full h-1 bg-slate-800/60 hover:h-2 cursor-pointer transition-all relative group"
        title="Click to seek"
      >
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 relative transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Current Song Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-[280px] flex-shrink-0">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${artworkGradient} flex items-center justify-center flex-shrink-0 shadow-md border border-white/10`}
          >
            <span className="text-xs font-bold text-white tracking-wider">
              {currentSong.title?.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-slate-100 truncate hover:text-indigo-400 transition-colors">
                {currentSong.title}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate mt-0.5">
              <span className="truncate">{currentSong.artist}</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-slate-500">{currentSong.genre}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Controls & Desktop Scrubber */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Shuffle */}
            <button
              type="button"
              onClick={onToggleShuffle}
              className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                isShuffle ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
            >
              <Shuffle size={16} />
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={onPrevious}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous song"
              aria-label="Previous song"
            >
              <SkipBack size={18} />
            </button>

            {/* Play / Pause Primary */}
            <button
              type="button"
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all active:scale-95 border border-violet-400/30"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={onNext}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next song"
              aria-label="Next song"
            >
              <SkipForward size={18} />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={onToggleRepeat}
              className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                isRepeat ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
              }`}
              title={isRepeat ? 'Repeat enabled' : 'Repeat disabled'}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Time scrubber (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5 w-full mt-1.5 text-[11px] font-mono text-slate-400">
            <span className="w-9 text-right">{formatDuration(currentTime)}</span>
            <div
              onClick={handleScrubberClick}
              className="flex-1 h-1.5 bg-slate-800 rounded-full cursor-pointer relative group overflow-hidden"
            >
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-100 group-hover:bg-indigo-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="w-9 text-left">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right Section: Volume & Mini status */}
        <div className="flex items-center justify-end gap-2 max-w-[180px] flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-slate-800 accent-indigo-500 rounded-lg cursor-pointer"
              title={`Volume ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>

          <div className="hidden lg:block">
            <Badge genre={currentSong.genre} size="xs" />
          </div>
        </div>
      </div>
    </footer>
  )
}
