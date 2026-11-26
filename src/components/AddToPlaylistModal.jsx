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
      subtitle={`Choose a playlist for "${song.title}"`}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        {/* Song Mini Preview with Image */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#242424] border border-white/5">
          <div className="w-12 h-12 rounded-lg bg-[#282828] overflow-hidden flex-shrink-0 shadow-sm border border-white/10">
            {song.coverUrl ? (
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-emerald-700 to-teal-900">
                <Music size={18} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
            <p className="text-xs text-[#b3b3b3] truncate">{song.artist} • {song.genre}</p>
          </div>
        </div>

        {/* Playlists list */}
        {playlists.length === 0 ? (
          <div className="text-center py-6 px-4 bg-[#242424]/60 rounded-xl border border-white/5">
            <Music size={28} className="mx-auto text-[#727272] mb-2" />
            <p className="text-sm text-white font-semibold">No playlists created yet</p>
            <p className="text-xs text-[#b3b3b3] mt-1 mb-4">
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
                  className="flex items-center justify-between p-3 rounded-xl bg-[#242424] border border-white/5 hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {playlist.name}
                    </h4>
                    <p className="text-xs text-[#b3b3b3] font-mono mt-0.5">
                      {formatPlaylistDetails(playlist.songIds.length, totalSecs)}
                    </p>
                  </div>

                  <div>
                    {isAlreadyAdded ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#1ed760] bg-[#1ed760]/10 border border-[#1ed760]/30 px-3 py-1 rounded-full font-semibold">
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
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-1">
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onCreatePlaylistRequest) onCreatePlaylistRequest()
              }}
              className="text-xs text-[#1ed760] hover:underline flex items-center gap-1 font-semibold"
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
