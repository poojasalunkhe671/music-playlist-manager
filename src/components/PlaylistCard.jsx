import React, { useState } from 'react'
import { Play, Music, Edit2, Trash2 } from 'lucide-react'
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
  const [imageError, setImageError] = useState(false)

  if (!playlist) return null

  // Calculate song count and total duration
  const playlistSongs = playlist.songIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)

  const songCount = playlistSongs.length
  const totalSeconds = playlistSongs.reduce((acc, song) => acc + (song.duration || 0), 0)
  const detailsText = formatPlaylistDetails(songCount, totalSeconds)

  const topSong = playlistSongs[0]
  const primaryGradient =
    topSong?.gradient || 'from-emerald-700 via-teal-800 to-slate-900'

  return (
    <div
      onClick={() => onSelect && onSelect(playlist)}
      className={`group relative flex flex-col p-2.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-[#282828] shadow-2xl border border-white/10'
          : 'bg-[#181818] hover:bg-[#282828] border border-transparent shadow-md hover:shadow-2xl'
      }`}
    >
      {/* Artwork Thumbnail with Image & Spotify Green Quick Play button */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 sm:mb-3 bg-[#282828] shadow-md">
        {topSong?.coverUrl && !imageError ? (
          <img
            src={topSong.coverUrl}
            alt={playlist.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${primaryGradient} flex items-center justify-center p-2 relative`}
          >
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg mb-1">
                <Music size={18} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 max-w-[100px] truncate">
                {playlist.name}
              </span>
            </div>
          </div>
        )}

        {/* Spotify signature green floating play button */}
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
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black shadow-2xl flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-0 z-20"
        >
          <Play size={16} className="translate-x-0.5" fill="currentColor" />
        </button>
      </div>

      {/* Title & Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className={`font-bold text-xs sm:text-sm truncate transition-colors ${
                isSelected ? 'text-[#1ed760]' : 'text-white'
              }`}
            >
              {playlist.name}
            </h3>
            {isSelected && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1ed760] flex-shrink-0"></span>
            )}
          </div>

          <p className="text-[10px] sm:text-xs text-[#b3b3b3] font-medium mt-0.5 truncate">
            {detailsText}
          </p>
        </div>

        {/* Action icons (Rename & Delete) */}
        <div className="flex items-center justify-end gap-1 mt-2 sm:mt-3 pt-2 border-t border-white/5">
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onRename && onRename(playlist)
            }}
            title="Rename playlist"
            className="text-[#b3b3b3] hover:text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px]"
            icon={<Edit2 size={12} />}
          >
            <span className="hidden sm:inline text-xs">Rename</span>
          </Button>

          <Button
            size="xs"
            variant="dangerGhost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete(playlist)
            }}
            title="Delete playlist"
            className="text-rose-400 hover:text-rose-300 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px]"
            icon={<Trash2 size={12} />}
          >
            <span className="hidden sm:inline text-xs">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
