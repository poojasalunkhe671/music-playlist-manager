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
    <header className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-[#0d1222] rounded-[11px] flex items-center justify-center text-indigo-400">
              <Radio size={20} className="animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              SoundVault
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">
              Music Playlist Manager
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Responsive) */}
        <nav className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Library size={14} />
            <span className="hidden sm:inline">Song Library</span>
            <span className="sm:hidden">Library</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('playlists')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'playlists' || activeTab === 'playlist-detail'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderHeart size={14} />
            <span className="hidden sm:inline">Playlists</span>
            <span className="sm:hidden">Playlists</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-mono ml-0.5">
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
