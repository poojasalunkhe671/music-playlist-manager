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
  activePlaylist = null,
  onReorderSongs
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('ALL')
  const [draggedSongId, setDraggedSongId] = useState(null)
  const [dragOverSongId, setDragOverSongId] = useState(null)

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

  // Reorder Handlers (Move Up / Down & Drag-and-Drop for Library)
  const handleMoveUp = (index) => {
    if (index <= 0 || !onReorderSongs) return
    const targetSong = filteredSongs[index]
    const prevSong = filteredSongs[index - 1]
    const newSongs = [...songs]
    const idxA = newSongs.findIndex((s) => s.id === targetSong.id)
    const idxB = newSongs.findIndex((s) => s.id === prevSong.id)
    if (idxA !== -1 && idxB !== -1) {
      const temp = newSongs[idxA]
      newSongs[idxA] = newSongs[idxB]
      newSongs[idxB] = temp
      onReorderSongs(newSongs)
    }
  }

  const handleMoveDown = (index) => {
    if (index >= filteredSongs.length - 1 || !onReorderSongs) return
    const targetSong = filteredSongs[index]
    const nextSong = filteredSongs[index + 1]
    const newSongs = [...songs]
    const idxA = newSongs.findIndex((s) => s.id === targetSong.id)
    const idxB = newSongs.findIndex((s) => s.id === nextSong.id)
    if (idxA !== -1 && idxB !== -1) {
      const temp = newSongs[idxA]
      newSongs[idxA] = newSongs[idxB]
      newSongs[idxB] = temp
      onReorderSongs(newSongs)
    }
  }

  const handleDragStart = (e, songId) => {
    setDraggedSongId(songId)
    e.dataTransfer.setData('text/plain', songId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetSongId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverSongId !== targetSongId) {
      setDragOverSongId(targetSongId)
    }
  }

  const handleDrop = (e, targetSongId) => {
    e.preventDefault()
    if (!draggedSongId || draggedSongId === targetSongId || !onReorderSongs) {
      setDraggedSongId(null)
      setDragOverSongId(null)
      return
    }

    const newSongs = [...songs]
    const fromIndex = newSongs.findIndex((s) => s.id === draggedSongId)
    const toIndex = newSongs.findIndex((s) => s.id === targetSongId)

    if (fromIndex !== -1 && toIndex !== -1) {
      const [movedSong] = newSongs.splice(fromIndex, 1)
      newSongs.splice(toIndex, 0, movedSong)
      onReorderSongs(newSongs)
    }

    setDraggedSongId(null)
    setDragOverSongId(null)
  }

  const handleDragEnd = () => {
    setDraggedSongId(null)
    setDragOverSongId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Bar Header (Spotify Styled) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181818] p-4 sm:p-5 rounded-2xl border border-white/5 shadow-md">
        {/* Search Input */}
        <div className="w-full md:max-w-md">
          <Input
            placeholder="What do you want to play?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            icon={<Search size={16} />}
          />
        </div>

        {/* Status / Quick Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-[#b3b3b3]">
          <span className="font-mono">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
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

      {/* Genre Filter Pills (Spotify Pill Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedGenre('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedGenre === 'ALL'
              ? 'bg-white text-black shadow-md'
              : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
          }`}
        >
          All ({songs.length})
        </button>

        {Object.entries(genres).map(([genre, count]) => {
          const isSelected = selectedGenre === genre
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {genre} ({count})
            </button>
          )
        })}
      </div>

      {/* Song list container */}
      <div className="flex flex-col gap-1">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#181818]/60 animate-pulse"
              >
                <div className="flex items-center gap-3 w-1/2">
                  <div className="w-8 h-8 rounded-full bg-[#282828]"></div>
                  <div className="w-10 h-10 rounded-md bg-[#282828]"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-[#282828] rounded w-3/4"></div>
                    <div className="h-2.5 bg-[#282828]/60 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="w-16 h-6 rounded-full bg-[#282828]/60 hidden sm:block"></div>
                <div className="w-16 h-8 rounded-full bg-[#282828]"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-12 px-4 bg-[#181818] rounded-2xl border border-rose-500/20">
            <p className="text-rose-400 text-sm font-semibold mb-2">Error loading song library</p>
            <p className="text-[#b3b3b3] text-xs mb-4">{error}</p>
            <Button size="sm" variant="secondary" onClick={onRefresh}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty / No Results State */}
        {!isLoading && !error && filteredSongs.length === 0 && (
          <div className="text-center py-14 px-4 bg-[#181818] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center text-[#1ed760] mb-3">
              <Music2 size={28} />
            </div>
            <h3 className="text-base font-bold text-white">No songs found</h3>
            <p className="text-xs text-[#b3b3b3] max-w-sm mt-1 mb-5">
              {searchTerm || selectedGenre !== 'ALL'
                ? `No songs matched "${searchTerm || selectedGenre}". Try refining your keywords or clearing the genre filter.`
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

        {/* Song Rows (With Up/Down and Drag and Drop Reordering!) */}
        {!isLoading &&
          !error &&
          filteredSongs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id
            const isAddedToActive = activePlaylist?.songIds.includes(song.id)
            const canMoveUp = index > 0
            const canMoveDown = index < filteredSongs.length - 1
            const isDragOver = dragOverSongId === song.id

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
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                isDraggable={true}
                onDragStart={(e) => handleDragStart(e, song.id)}
                onDragOver={(e) => handleDragOver(e, song.id)}
                onDrop={(e) => handleDrop(e, song.id)}
                onDragEnd={handleDragEnd}
                isDragOver={isDragOver}
              />
            )
          })}
      </div>
    </div>
  )
}
