import React, { useState } from 'react'
import {
  Plus,
  Play,
  Edit2,
  Trash2,
  ListMusic,
  FolderPlus,
  Sparkles,
  ArrowRight,
  Music
} from 'lucide-react'
import { formatPlaylistDetails } from '../utils/formatters'
import SongRow from './SongRow'
import Button from './common/Button'

export default function PlaylistView({
  playlists = [],
  selectedPlaylistId,
  onSelectPlaylist,
  songs = [],
  currentSong = null,
  isPlaying = false,
  onPlaySong,
  onPlayEntirePlaylist,
  onCreatePlaylistRequest,
  onRenamePlaylistRequest,
  onDeletePlaylistRequest,
  onRemoveSongFromPlaylist,
  onReorderPlaylistSongs,
  onNavigateToLibrary
}) {
  const [draggedSongId, setDraggedSongId] = useState(null)
  const [dragOverSongId, setDragOverSongId] = useState(null)

  const selectedPlaylist =
    playlists.find((p) => p.id === selectedPlaylistId) || playlists[0] || null

  // Map songIds to full song objects in order
  const playlistSongs = selectedPlaylist
    ? selectedPlaylist.songIds
        .map((id) => songs.find((s) => s.id === id))
        .filter(Boolean)
    : []

  const totalSeconds = playlistSongs.reduce((sum, s) => sum + (s.duration || 0), 0)
  const detailsSummary = formatPlaylistDetails(playlistSongs.length, totalSeconds)

  const topSong = playlistSongs[0]
  const heroCoverUrl = topSong?.coverUrl || null

  // Move up handler
  const handleMoveUp = (index) => {
    if (index <= 0 || !selectedPlaylist) return
    const newSongIds = [...selectedPlaylist.songIds]
    const temp = newSongIds[index]
    newSongIds[index] = newSongIds[index - 1]
    newSongIds[index - 1] = temp
    onReorderPlaylistSongs(selectedPlaylist.id, newSongIds)
  }

  // Move down handler
  const handleMoveDown = (index) => {
    if (!selectedPlaylist || index >= selectedPlaylist.songIds.length - 1) return
    const newSongIds = [...selectedPlaylist.songIds]
    const temp = newSongIds[index]
    newSongIds[index] = newSongIds[index + 1]
    newSongIds[index + 1] = temp
    onReorderPlaylistSongs(selectedPlaylist.id, newSongIds)
  }

  // HTML5 Drag and drop handlers
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
    if (!draggedSongId || draggedSongId === targetSongId || !selectedPlaylist) {
      setDraggedSongId(null)
      setDragOverSongId(null)
      return
    }

    const currentIds = [...selectedPlaylist.songIds]
    const fromIndex = currentIds.indexOf(draggedSongId)
    const toIndex = currentIds.indexOf(targetSongId)

    if (fromIndex !== -1 && toIndex !== -1) {
      currentIds.splice(fromIndex, 1)
      currentIds.splice(toIndex, 0, draggedSongId)
      onReorderPlaylistSongs(selectedPlaylist.id, currentIds)
    }

    setDraggedSongId(null)
    setDragOverSongId(null)
  }

  const handleDragEnd = () => {
    setDraggedSongId(null)
    setDragOverSongId(null)
  }

  // If no playlists exist at all
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-[#181818] rounded-2xl border border-white/5 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#242424] text-[#1ed760] flex items-center justify-center mb-4 shadow-xl">
          <FolderPlus size={28} className="sm:hidden" />
          <FolderPlus size={32} className="hidden sm:block" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">No playlists yet</h3>
        <p className="text-xs text-[#b3b3b3] max-w-sm mt-1 mb-6">
          Create playlists to curate your personal soundtracks, workout mixes, and study vibes.
        </p>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={onCreatePlaylistRequest}
        >
          Create First Playlist
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Playlist Selector Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {playlists.map((playlist) => {
          const isSelected = selectedPlaylist?.id === playlist.id
          const pSongs = playlist.songIds
            .map((id) => songs.find((s) => s.id === id))
            .filter(Boolean)

          return (
            <button
              key={playlist.id}
              type="button"
              onClick={() => onSelectPlaylist(playlist.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <ListMusic size={13} className="sm:hidden" />
              <ListMusic size={14} className="hidden sm:block" />
              <span>{playlist.name}</span>
              <span className="opacity-75 text-[11px] font-mono">
                ({pSongs.length})
              </span>
            </button>
          )
        })}

        {/* Quick create button chip */}
        <button
          type="button"
          onClick={onCreatePlaylistRequest}
          className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-[#242424] text-[#1ed760] hover:bg-[#2a2a2a] transition-colors"
          title="Create a new playlist"
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </div>

      {/* Selected Playlist Hero Details Card (Mobile & Desktop Responsive) */}
      {selectedPlaylist && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e3a2f] via-[#181818] to-[#121212] border border-white/5 p-4 sm:p-7 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            {/* Spotify Album Cover Art */}
            <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-xl overflow-hidden bg-[#242424] shadow-2xl flex-shrink-0 border border-white/10 relative group">
              {heroCoverUrl ? (
                <img
                  src={heroCoverUrl}
                  alt={selectedPlaylist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-950 text-white">
                  <Music size={32} className="sm:hidden mb-1 opacity-80" />
                  <Music size={40} className="hidden sm:block mb-2 opacity-80" />
                  <span className="text-[11px] sm:text-xs font-bold px-2 text-center truncate max-w-full">
                    {selectedPlaylist.name}
                  </span>
                </div>
              )}
            </div>

            {/* Playlist Info & Metadata */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#b3b3b3]">
                Playlist
              </span>

              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight truncate mt-0.5 sm:mt-1">
                {selectedPlaylist.name}
              </h2>

              {selectedPlaylist.description && (
                <p className="text-xs text-[#b3b3b3] mt-1 sm:mt-2 max-w-xl line-clamp-2">
                  {selectedPlaylist.description}
                </p>
              )}

              {/* Requirement #5: show song count and total duration (e.g. "8 songs · 32 min") */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 sm:mt-3 text-xs text-white">
                <span className="font-semibold">{detailsSummary}</span>
                <span className="text-[#727272] hidden sm:inline">• Drag songs or use arrow buttons to reorder</span>
              </div>

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onPlayEntirePlaylist(selectedPlaylist)}
                  disabled={playlistSongs.length === 0}
                  icon={<Play size={16} fill="currentColor" />}
                  title={playlistSongs.length === 0 ? 'Playlist is empty' : 'Play all songs'}
                  className="shadow-xl px-4 py-1.5 sm:px-5 sm:py-2"
                >
                  Play
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Edit2 size={13} />}
                  onClick={() => onRenamePlaylistRequest(selectedPlaylist)}
                  title="Rename playlist"
                  className="px-3 py-1.5 sm:px-4"
                >
                  Rename
                </Button>

                <Button
                  size="sm"
                  variant="dangerGhost"
                  icon={<Trash2 size={13} />}
                  onClick={() => onDeletePlaylistRequest(selectedPlaylist)}
                  title="Delete playlist"
                  className="px-3 py-1.5 sm:px-4"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Songs List */}
      <div className="flex flex-col gap-1">
        {playlistSongs.length === 0 ? (
          /* Empty Playlist State */
          <div className="text-center py-12 sm:py-14 px-4 bg-[#181818] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#242424] flex items-center justify-center text-[#1ed760] mb-3">
              <Sparkles size={22} className="sm:hidden" />
              <Sparkles size={26} className="hidden sm:block" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              This playlist is empty
            </h3>
            <p className="text-xs text-[#b3b3b3] max-w-sm mt-1 mb-5">
              Add some tracks from the Song Library to get the music flowing!
            </p>
            <Button
              size="sm"
              variant="primary"
              icon={<ArrowRight size={14} />}
              onClick={onNavigateToLibrary}
            >
              Browse Song Library
            </Button>
          </div>
        ) : (
          playlistSongs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id
            const canMoveUp = index > 0
            const canMoveDown = index < playlistSongs.length - 1
            const isDragOver = dragOverSongId === song.id

            return (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                isCurrentSong={isCurrentSong}
                isPlaying={isPlaying}
                onPlay={onPlaySong}
                mode="playlist"
                onRemove={(songId) =>
                  onRemoveSongFromPlaylist(selectedPlaylist.id, songId)
                }
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
          })
        )}
      </div>
    </div>
  )
}
