import React, { useState, useMemo } from 'react'
import { Search, Music2, RefreshCw } from 'lucide-react'
import SongRow from './SongRow'
import Input from './common/Input'
import Button from './common/Button'

export default function SongLibrary({
  songs = [],
  isLoading = false,
  error = null,
  onRefresh,
  currentSong = null,
  isPlaying = false,
  onPlaySong,
  onAddToPlaylist,
  activePlaylist = null
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('ALL')

  // Calculate unique genres & counts
  const genres = useMemo(() => {
    const counts = {}
    songs.forEach((s) => {
      counts[s.genre] = (counts[s.genre] || 0) + 1
    })
    return counts
  }, [songs])

  // Filter songs by search query (title, artist, album, genre) and genre
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesGenre =
        selectedGenre === 'ALL' || song.genre.toLowerCase() === selectedGenre.toLowerCase()

      const term = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !term ||
        song.title.toLowerCase().includes(term) ||
        song.artist.toLowerCase().includes(term) ||
        song.genre.toLowerCase().includes(term) ||
        (song.album && song.album.toLowerCase().includes(term))

      return matchesGenre && matchesSearch
    })
  }, [songs, searchTerm, selectedGenre])

  return (
    <div className="flex flex-col gap-5">
      {/* Search and Filter Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        {/* Search Input */}
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search by title, artist, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            icon={<Search size={16} />}
          />
        </div>

        {/* Status / Quick Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-400">
          <span className="font-mono">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'} found
          </span>
          {onRefresh && (
            <Button
              size="xs"
              variant="ghost"
              onClick={onRefresh}
              title="Reload songs from songs.json"
              icon={<RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />}
            >
              Reload
            </Button>
          )}
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedGenre('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
            selectedGenre === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          All Genres ({songs.length})
        </button>

        {Object.entries(genres).map(([genre, count]) => {
          const isSelected = selectedGenre === genre
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {genre} ({count})
            </button>
          )
        })}
      </div>

      {/* Song list container */}
      <div className="flex flex-col gap-2">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/40 animate-pulse"
              >
                <div className="flex items-center gap-3 w-1/2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-2.5 bg-slate-800/60 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="w-16 h-6 rounded-full bg-slate-800/60 hidden sm:block"></div>
                <div className="w-16 h-8 rounded-lg bg-slate-800/80"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-rose-500/20">
            <p className="text-rose-400 text-sm font-medium mb-2">Error loading song library</p>
            <p className="text-slate-400 text-xs mb-4">{error}</p>
            <Button size="sm" variant="secondary" onClick={onRefresh}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty / No Results State */}
        {!isLoading && !error && filteredSongs.length === 0 && (
          <div className="text-center py-14 px-4 bg-slate-900/30 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
              <Music2 size={28} />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No songs found</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
              {searchTerm || selectedGenre !== 'ALL'
                ? `No songs matched your search "${searchTerm || selectedGenre}". Try refining your keywords or clearing the genre filter.`
                : 'Your song library is currently empty.'}
            </p>
            {(searchTerm || selectedGenre !== 'ALL') && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedGenre('ALL')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Song Rows */}
        {!isLoading &&
          !error &&
          filteredSongs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id
            const isAddedToActive = activePlaylist?.songIds.includes(song.id)

            return (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                isCurrentSong={isCurrentSong}
                isPlaying={isPlaying}
                onPlay={onPlaySong}
                mode="library"
                onAddToPlaylist={onAddToPlaylist}
                isAddedToActivePlaylist={isAddedToActive}
              />
            )
          })}
      </div>
    </div>
  )
}
