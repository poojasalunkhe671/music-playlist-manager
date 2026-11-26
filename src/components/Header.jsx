import React from 'react'
import { Music, Plus, Radio, Library, FolderHeart } from 'lucide-react'
import Button from './common/Button'

export default function Header({
  activeTab,
  onTabChange,
  onCreatePlaylistRequest,
  totalSongsCount = 0,
  totalPlaylistsCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name (Spotify Vibe) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-lg shadow-[#1ed760]/20 flex-shrink-0">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                SoundVault
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-[#242424] text-[#1ed760] font-semibold px-2 py-0.5 rounded-full border border-[#1ed760]/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#b3b3b3] font-medium hidden sm:block">
              Music Playlist Manager
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Spotify Pill Tabs) */}
        <nav className="flex items-center p-1 bg-[#181818] rounded-full border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'library'
                ? 'bg-white text-black shadow-md'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Library size={14} />
            <span className="hidden sm:inline">Song Library</span>
            <span className="sm:hidden">Library</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('playlists')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'playlists' || activeTab === 'playlist-detail'
                ? 'bg-white text-black shadow-md'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <FolderHeart size={14} />
            <span className="hidden sm:inline">Playlists</span>
            <span className="sm:hidden">Playlists</span>
            <span className="text-[10px] bg-[#282828] text-white px-1.5 py-0.2 rounded-full font-mono ml-0.5">
              {totalPlaylistsCount}
            </span>
          </button>
        </nav>

        {/* Create Playlist CTA */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={15} />}
            onClick={onCreatePlaylistRequest}
            title="Create a new playlist"
          >
            <span className="hidden sm:inline">New Playlist</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
