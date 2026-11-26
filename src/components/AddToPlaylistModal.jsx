import React from 'react'
import Modal from './common/Modal'
import Button from './common/Button'
import { Plus, Check, Music } from 'lucide-react'
import { formatPlaylistDetails } from '../utils/formatters'

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  song,
  playlists = [],
  allSongs = [],
  onAddToPlaylist,
  onCreatePlaylistRequest
}) {
  if (!isOpen || !song) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Playlist"
      subtitle={`Choose a playlist for "${song.title}" by ${song.artist}`}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-3">
        {/* Playlists list */}
        {playlists.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <Music size={28} className="mx-auto text-slate-500 mb-2" />
            <p className="text-sm text-slate-300 font-medium">No playlists created yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Create your first playlist to start organizing your library
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => {
                onClose()
                if (onCreatePlaylistRequest) onCreatePlaylistRequest()
              }}
            >
              Create New Playlist
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {playlists.map((playlist) => {
              const isAlreadyAdded = playlist.songIds.includes(song.id)
              const playlistSongs = playlist.songIds
                .map((id) => allSongs.find((s) => s.id === id))
                .filter(Boolean)
              const totalSecs = playlistSongs.reduce((sum, s) => sum + (s.duration || 0), 0)

              return (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">
                      {playlist.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {formatPlaylistDetails(playlist.songIds.length, totalSecs)}
                    </p>
                  </div>

                  <div>
                    {isAlreadyAdded ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <Check size={13} />
                        <span>Added</span>
                      </span>
                    ) : (
                      <Button
                        size="xs"
                        variant="primary"
                        icon={<Plus size={13} />}
                        onClick={() => {
                          onAddToPlaylist(playlist.id, song)
                          onClose()
                        }}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer with create new playlist shortcut */}
        {playlists.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onCreatePlaylistRequest) onCreatePlaylistRequest()
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Plus size={14} />
              <span>Create new playlist</span>
            </button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
