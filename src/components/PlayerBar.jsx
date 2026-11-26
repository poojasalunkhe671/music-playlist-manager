import React, { useState } from 'react'
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
  const [imageError, setImageError] = useState(false)

  if (!currentSong) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#181818] border-t border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#b3b3b3]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center text-[#727272]">
              <Music size={16} />
            </div>
            <span>No song selected. Choose a song to start listening.</span>
          </div>
          <span className="hidden sm:inline text-[#727272] font-mono">00:00 / 00:00</span>
        </div>
      </footer>
    )
  }

  const duration = currentSong.duration || 180
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100))
  const artworkGradient = currentSong.gradient || 'from-emerald-600 to-teal-800'

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = Math.floor(newPercent * duration)
    if (onSeek) onSeek(newTime)
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#181818] border-t border-white/5 shadow-2xl transition-all">
      {/* Top micro progress bar for mobile and desktop (Spotify Green) */}
      <div
        onClick={handleScrubberClick}
        className="w-full h-1 bg-[#4d4d4d]/40 hover:h-2 cursor-pointer transition-all relative group"
        title="Click to seek"
      >
        <div
          className="h-full bg-[#1ed760] relative transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Current Song Info with Image */}
        <div className="flex items-center gap-3.5 min-w-0 max-w-[200px] sm:max-w-[280px] flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-[#282828] overflow-hidden flex-shrink-0 shadow-md border border-white/10 relative">
            {currentSong.coverUrl && !imageError ? (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${artworkGradient} flex items-center justify-center`}
              >
                <span className="text-xs font-bold text-white tracking-wider">
                  {currentSong.title?.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer transition-colors">
              {currentSong.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[#b3b3b3] truncate mt-0.5">
              <span className="hover:text-white hover:underline cursor-pointer truncate">
                {currentSong.artist}
              </span>
              <span className="hidden md:inline text-[#727272]">•</span>
              <span className="hidden md:inline text-[#b3b3b3]">{currentSong.genre}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Controls & Desktop Scrubber */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Shuffle */}
            <button
              type="button"
              onClick={onToggleShuffle}
              className={`p-1.5 rounded-full transition-colors hidden sm:block relative ${
                isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
            >
              <Shuffle size={16} />
              {isShuffle && (
                <span className="w-1 h-1 rounded-full bg-[#1ed760] absolute bottom-0 left-1/2 -translate-x-1/2"></span>
              )}
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={onPrevious}
              className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors"
              title="Previous song"
              aria-label="Previous song"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            {/* Play / Pause Circular Button */}
            <button
              type="button"
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-white hover:scale-105 active:scale-95 text-black shadow-lg flex items-center justify-center transition-all"
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
              className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors"
              title="Next song"
              aria-label="Next song"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={onToggleRepeat}
              className={`p-1.5 rounded-full transition-colors hidden sm:block relative ${
                isRepeat ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={isRepeat ? 'Repeat enabled' : 'Repeat disabled'}
            >
              <Repeat size={16} />
              {isRepeat && (
                <span className="w-1 h-1 rounded-full bg-[#1ed760] absolute bottom-0 left-1/2 -translate-x-1/2"></span>
              )}
            </button>
          </div>

          {/* Time scrubber (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5 w-full mt-2 text-[11px] font-mono text-[#b3b3b3]">
            <span className="w-9 text-right">{formatDuration(currentTime)}</span>
            <div
              onClick={handleScrubberClick}
              className="flex-1 h-1 bg-[#4d4d4d] hover:h-1.5 rounded-full cursor-pointer relative group overflow-hidden transition-all"
            >
              <div
                className="h-full bg-white group-hover:bg-[#1ed760] rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="w-9 text-left">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right Section: Volume & Badge */}
        <div className="flex items-center justify-end gap-2 max-w-[180px] flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-[#b3b3b3]">
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
              className="w-20 h-1 bg-[#4d4d4d] accent-[#1ed760] rounded-lg cursor-pointer hover:accent-[#1fdf64]"
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
