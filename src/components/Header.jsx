import React from 'react'
import { Plus, Radio, Library, FolderHeart } from 'lucide-react'
import Button from './common/Button'

export default function Header({
  activeTab,
  onTabChange,
  onCreatePlaylistRequest,
  totalSongsCount = 0,
  totalPlaylistsCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-xl border-b border-white/5 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-md shadow-[#1ed760]/20 flex-shrink-0">
            <Radio size={16} className="sm:hidden animate-pulse" />
            <Radio size={20} className="hidden sm:block animate-pulse" />
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white">
                SoundVault
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-[#242424] text-[#1ed760] font-semibold px-2 py-0.5 rounded-full border border-[#1ed760]/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#b3b3b3] font-medium hidden md:block">
              Music Playlist Manager
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Spotify Pill Tabs) */}
        <nav className="flex items-center p-0.5 sm:p-1 bg-[#181818] rounded-full border border-white/5 text-[11px] sm:text-xs font-semibold">
          <button
            type="button"
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'library'
                ? 'bg-white text-black shadow-md'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Library size={13} className="sm:hidden" />
            <Library size={14} className="hidden sm:block" />
            <span>Library</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('playlists')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 ${
              activeTab === 'playlists' || activeTab === 'playlist-detail'
                ? 'bg-white text-black shadow-md'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <FolderHeart size={13} className="sm:hidden" />
            <FolderHeart size={14} className="hidden sm:block" />
            <span>Playlists</span>
            <span className="text-[10px] bg-[#282828] text-white px-1.5 py-0.2 rounded-full font-mono">
              {totalPlaylistsCount}
            </span>
          </button>
        </nav>

        {/* Create Playlist CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={15} />}
            onClick={onCreatePlaylistRequest}
            title="Create a new playlist"
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs"
          >
            <span className="hidden sm:inline">New Playlist</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
