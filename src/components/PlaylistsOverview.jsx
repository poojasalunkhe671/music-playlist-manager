import React from 'react'
import { Plus, FolderPlus } from 'lucide-react'
import PlaylistCard from './PlaylistCard'
import Button from './common/Button'

export default function PlaylistsOverview({
  playlists = [],
  songs = [],
  selectedPlaylistId,
  onSelectPlaylist,
  onPlayPlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onCreatePlaylistRequest
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title and Create Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your Playlists
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated collections saved locally to your device
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Plus size={15} />}
          onClick={onCreatePlaylistRequest}
        >
          Create Playlist
        </Button>
      </div>

      {/* Grid of Playlist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Create New Card Placeholder */}
        <div
          onClick={onCreatePlaylistRequest}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/30 hover:bg-indigo-950/20 cursor-pointer transition-all duration-300 min-h-[220px] text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 border border-slate-700/80 group-hover:border-indigo-500/30 flex items-center justify-center mb-3 transition-colors">
            <Plus size={22} />
          </div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white">
            Create Playlist
          </h4>
          <p className="text-xs text-slate-500 max-w-[150px] mt-1">
            Build a unique soundtrack for any mood
          </p>
        </div>

        {/* Existing Playlist Cards */}
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            songs={songs}
            isSelected={selectedPlaylistId === playlist.id}
            onSelect={(pl) => onSelectPlaylist(pl.id)}
            onPlay={onPlayPlaylist}
            onRename={onRenamePlaylist}
            onDelete={onDeletePlaylist}
          />
        ))}
      </div>
    </div>
  )
}
