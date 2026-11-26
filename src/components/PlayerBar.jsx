import React, { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  ChevronDown,
  X,
  MoreVertical,
  Plus,
  Share2,
  ListMusic,
  Laptop2
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
  onToggleRepeat,
  activePlaylistName = 'Song Library',
  onAddToPlaylist
}) {
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Close full screen on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isExpanded])

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
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = Math.floor(newPercent * duration)
    if (onSeek) onSeek(newTime)
  }

  return (
    <>
      {/* 1. DOCKED BOTTOM PLAYER BAR */}
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
          {/* Left Section: Current Song Info (Click to open Spotify Player) */}
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3.5 min-w-0 max-w-[200px] sm:max-w-[280px] flex-shrink-0 cursor-pointer group"
            title="Click to expand player"
          >
            <div className="w-12 h-12 rounded-lg bg-[#282828] overflow-hidden flex-shrink-0 shadow-md border border-white/10 relative group-hover:scale-105 transition-transform">
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
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#1ed760] transition-colors">
                {currentSong.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#b3b3b3] truncate mt-0.5">
                <span className="truncate">{currentSong.artist}</span>
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

          {/* Right Section: Volume, Expand & Badge */}
          <div className="flex items-center justify-end gap-2.5 max-w-[180px] flex-shrink-0">
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

            {/* Expand / Full-Screen Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Expand player"
              aria-label="Expand player"
            >
              <ChevronDown size={18} className="rotate-180" />
            </button>

            <div className="hidden lg:block">
              <Badge genre={currentSong.genre} size="xs" />
            </div>
          </div>
        </div>
      </footer>

      {/* 2. FULL-SCREEN NOW PLAYING VIEW (RESPONSIVE: DESKTOP 2-COLUMN STUDIO + MOBILE VERTICAL) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-2xl text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-fadeIn overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-2 md:mb-6">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-2 -ml-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full active:scale-95 transition-all"
              aria-label="Minimize player"
            >
              <ChevronDown size={28} />
            </button>

            <div className="flex flex-col items-center text-center px-2 min-w-0">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#b3b3b3]">
                Playing from Playlist
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {activePlaylistName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onAddToPlaylist && onAddToPlaylist(currentSong)}
                className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full active:scale-95 transition-all"
                title="Add to playlist"
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full active:scale-95 transition-all"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Body: Desktop 2-Column Grid / Mobile Stack */}
          <div className="w-full max-w-5xl mx-auto my-auto flex-1 flex items-center justify-center py-2 md:py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center w-full">
              
              {/* Left Column: Big Album Cover Image */}
              <div className="flex justify-center items-center w-full">
                <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-[#242424] shadow-2xl border border-white/10 relative">
                  {currentSong.coverUrl && !imageError ? (
                    <img
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${artworkGradient} flex items-center justify-center`}
                    >
                      <Music size={72} className="text-white/80" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Song Info + Controls + Scrubber + Lyrics */}
              <div className="flex flex-col justify-center gap-4 md:gap-6 w-full max-w-md mx-auto md:max-w-none">
                
                {/* Title & Artist & (+) Button */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white truncate tracking-tight">
                      {currentSong.title}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-[#b3b3b3] truncate mt-1">
                      {currentSong.artist}
                    </p>
                    <div className="mt-2">
                      <Badge genre={currentSong.genre} size="xs" />
                    </div>
                  </div>

                  {/* Spotify (+) Button */}
                  <button
                    type="button"
                    onClick={() => onAddToPlaylist && onAddToPlaylist(currentSong)}
                    className="w-11 h-11 rounded-full border-2 border-white/80 hover:border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                    title="Add to playlist"
                  >
                    <Plus size={22} />
                  </button>
                </div>

                {/* Scrubber Progress Bar */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <div
                    onClick={handleScrubberClick}
                    className="w-full h-1.5 bg-[#4d4d4d]/60 hover:h-2.5 rounded-full cursor-pointer relative group transition-all"
                  >
                    <div
                      className="h-full bg-white group-hover:bg-[#1ed760] rounded-full transition-all duration-100 relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg"></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#b3b3b3]">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Main Player Controls */}
                <div className="flex items-center justify-between px-2 pt-2">
                  {/* Shuffle */}
                  <button
                    type="button"
                    onClick={onToggleShuffle}
                    className={`p-2.5 rounded-full transition-colors relative ${
                      isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
                    }`}
                    title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
                  >
                    <Shuffle size={22} />
                    {isShuffle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] absolute bottom-1 left-1/2 -translate-x-1/2"></span>
                    )}
                  </button>

                  {/* Previous */}
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="p-2.5 text-white hover:text-white/80 active:scale-95 transition-all"
                    title="Previous track"
                  >
                    <SkipBack size={32} fill="currentColor" />
                  </button>

                  {/* Large Center Play / Pause Button */}
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={28} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" className="translate-x-0.5" />
                    )}
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={onNext}
                    className="p-2.5 text-white hover:text-white/80 active:scale-95 transition-all"
                    title="Next track"
                  >
                    <SkipForward size={32} fill="currentColor" />
                  </button>

                  {/* Repeat */}
                  <button
                    type="button"
                    onClick={onToggleRepeat}
                    className={`p-2.5 rounded-full transition-colors relative ${
                      isRepeat ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
                    }`}
                    title={isRepeat ? 'Repeat enabled' : 'Repeat disabled'}
                  >
                    <Repeat size={22} />
                    {isRepeat && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] absolute bottom-1 left-1/2 -translate-x-1/2"></span>
                    )}
                  </button>
                </div>

                {/* Desktop Volume & Accessories */}
                <div className="flex items-center justify-between text-[#b3b3b3] pt-2 px-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onToggleMute}
                      className="hover:text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} className="text-[#1ed760]" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
                      className="w-24 sm:w-32 h-1 bg-[#4d4d4d] accent-[#1ed760] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href)
                        alert('Song link copied to clipboard!')
                      }}
                      className="hover:text-white transition-colors"
                      title="Share song"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="hover:text-white transition-colors"
                      title="Close to library"
                    >
                      <ListMusic size={20} />
                    </button>
                  </div>
                </div>

                {/* Lyrics Preview Drawer Card */}
                <div className="bg-[#1e3a2f]/60 border border-white/5 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white tracking-wide">
                      Lyrics preview
                    </span>
                    <span className="text-[10px] text-[#1ed760] font-semibold uppercase">
                      Live
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white/90 leading-relaxed italic">
                    &ldquo;Immersed in soundwaves, moving with the beat of the night...&rdquo;
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
