import React, { useState } from 'react'
import {
  Plus,
  Play,
  Edit2,
  Trash2,
  ListMusic,
  FolderPlus,
  Sparkles,
  ArrowRight
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
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-xl">
          <FolderPlus size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">No playlists yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
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
    <div className="flex flex-col gap-6">
      {/* Playlist Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400/30 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <ListMusic size={14} />
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/40 hover:text-indigo-200 transition-colors"
          title="Create a new playlist"
        >
          <Plus size={14} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Selected Playlist Hero Details Card */}
      {selectedPlaylist && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Playlist Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/20">
                  Playlist
                </span>
                {selectedPlaylist.createdAt && (
                  <span className="text-xs text-slate-500">
                    Created {new Date(selectedPlaylist.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {selectedPlaylist.name}
              </h2>

              {selectedPlaylist.description && (
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {selectedPlaylist.description}
                </p>
              )}

              {/* Requirement #5: show song count and total duration (e.g. "8 songs · 32 min") */}
              <div className="flex items-center gap-2 mt-3 text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-indigo-300 font-semibold">
                  {detailsSummary}
                </span>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  • Drag songs or use arrow buttons to reorder
                </span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Play Entire Playlist */}
              <Button
                size="sm"
                variant="primary"
                onClick={() => onPlayEntirePlaylist(selectedPlaylist)}
                disabled={playlistSongs.length === 0}
                icon={<Play size={15} fill="currentColor" />}
                title={playlistSongs.length === 0 ? 'Playlist is empty' : 'Play all songs'}
              >
                Play All
              </Button>

              {/* Rename */}
              <Button
                size="sm"
                variant="secondary"
                icon={<Edit2 size={14} />}
                onClick={() => onRenamePlaylistRequest(selectedPlaylist)}
                title="Rename playlist"
              >
                Rename
              </Button>

              {/* Delete */}
              <Button
                size="sm"
                variant="dangerGhost"
                icon={<Trash2 size={14} />}
                onClick={() => onDeletePlaylistRequest(selectedPlaylist)}
                title="Delete playlist"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Songs List */}
      <div className="flex flex-col gap-2">
        {playlistSongs.length === 0 ? (
          /* Empty Playlist State (Required by PDF) */
          <div className="text-center py-14 px-4 bg-slate-900/30 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
              <Sparkles size={26} className="text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">
              This playlist is empty
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
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
