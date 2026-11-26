import React from 'react'
import { Plus } from 'lucide-react'
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Playlists
          </h2>
          <p className="text-xs text-[#b3b3b3] mt-1">
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
          className="group flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#404040] hover:border-[#1ed760] bg-[#181818]/60 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-h-[220px] text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#242424] group-hover:bg-[#1ed760] text-[#b3b3b3] group-hover:text-black flex items-center justify-center mb-3 transition-colors shadow-md">
            <Plus size={22} />
          </div>
          <h4 className="text-sm font-bold text-white">
            Create Playlist
          </h4>
          <p className="text-xs text-[#b3b3b3] max-w-[150px] mt-1">
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
