import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Header from './components/Header'
import SongLibrary from './components/SongLibrary'
import PlaylistsOverview from './components/PlaylistsOverview'
import PlaylistView from './components/PlaylistView'
import PlayerBar from './components/PlayerBar'
import PlaylistModal from './components/PlaylistModal'
import ConfirmModal from './components/ConfirmModal'
import AddToPlaylistModal from './components/AddToPlaylistModal'
import Toast from './components/common/Toast'
import { getSavedPlaylists, savePlaylists } from './utils/storage'

export default function App() {
  // Songs loaded from public/songs.json via Axios
  const [songs, setSongs] = useState([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const [songsError, setSongsError] = useState(null)

  // Playlists saved in localStorage
  const [playlists, setPlaylists] = useState(() => getSavedPlaylists())
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

  // Navigation tab: 'library' | 'playlists' | 'playlist-detail'
  const [activeTab, setActiveTab] = useState('library')

  // Player state
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [activeQueue, setActiveQueue] = useState([]) // array of song IDs

  // Modal dialog states
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
  const [playlistToEdit, setPlaylistToEdit] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [playlistToDelete, setPlaylistToDelete] = useState(null)
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false)
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState(null)

  // Toast feedback state
  const [toast, setToast] = useState(null)
  const toastTimeoutRef = useRef(null)

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToast({ message, type })
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null)
    }, 3200)
  }

  // Set default selected playlist if none selected
  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id)
    }
  }, [playlists, selectedPlaylistId])

  // Save playlists to localStorage on state changes
  useEffect(() => {
    savePlaylists(playlists)
  }, [playlists])

  // Fetch songs from public/songs.json with Axios
  const fetchSongs = async () => {
    setIsLoadingSongs(true)
    setSongsError(null)
    try {
      const response = await axios.get('/songs.json')
      if (Array.isArray(response.data)) {
        setSongs(response.data)
        // Set initial queue to all songs
        if (activeQueue.length === 0) {
          setActiveQueue(response.data.map((s) => s.id))
        }
      } else {
        throw new Error('Invalid song data structure received')
      }
    } catch (err) {
      console.error('Error fetching songs with Axios:', err)
      setSongsError(err.message || 'Failed to load songs from public/songs.json')
    } finally {
      setIsLoadingSongs(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  // Simulated player playback timer
  useEffect(() => {
    let interval = null
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            handleNextSong()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentSong, activeQueue, isRepeat, isShuffle])

  // Player controls
  const handlePlaySong = (song, queue = null) => {
    if (currentSong?.id === song.id) {
      // Toggle play/pause if same song
      setIsPlaying((prev) => !prev)
    } else {
      setCurrentSong(song)
      setCurrentTime(0)
      setIsPlaying(true)
      if (queue && queue.length > 0) {
        setActiveQueue(queue)
      } else if (activeQueue.length === 0 && songs.length > 0) {
        setActiveQueue(songs.map((s) => s.id))
      }
    }
  }

  const handleTogglePlay = () => {
    if (!currentSong && songs.length > 0) {
      handlePlaySong(songs[0])
    } else if (currentSong) {
      setIsPlaying((prev) => !prev)
    }
  }

  const handleNextSong = () => {
    if (!currentSong || songs.length === 0) return

    const currentList = activeQueue.length > 0 ? activeQueue : songs.map((s) => s.id)
    const currentIndex = currentList.indexOf(currentSong.id)

    if (isRepeat) {
      setCurrentTime(0)
      setIsPlaying(true)
      return
    }

    let nextIndex = 0
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentList.length)
      if (nextIndex === currentIndex && currentList.length > 1) {
        nextIndex = (currentIndex + 1) % currentList.length
      }
    } else {
      nextIndex = (currentIndex + 1) % currentList.length
    }

    const nextSongId = currentList[nextIndex]
    const nextSong = songs.find((s) => s.id === nextSongId) || songs[0]
    setCurrentSong(nextSong)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handlePreviousSong = () => {
    if (!currentSong || songs.length === 0) return

    // If more than 3 seconds in, restart current song
    if (currentTime > 3) {
      setCurrentTime(0)
      return
    }

    const currentList = activeQueue.length > 0 ? activeQueue : songs.map((s) => s.id)
    const currentIndex = currentList.indexOf(currentSong.id)

    let prevIndex = (currentIndex - 1 + currentList.length) % currentList.length
    const prevSongId = currentList[prevIndex]
    const prevSong = songs.find((s) => s.id === prevSongId) || songs[0]
    setCurrentSong(prevSong)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleSeek = (newTime) => {
    setCurrentTime(newTime)
  }

  // Play entire playlist
  const handlePlayEntirePlaylist = (playlist) => {
    if (!playlist || playlist.songIds.length === 0) {
      showToast('This playlist has no songs to play', 'error')
      return
    }
    const firstSong = songs.find((s) => s.id === playlist.songIds[0])
    if (firstSong) {
      handlePlaySong(firstSong, playlist.songIds)
      showToast(`Playing playlist "${playlist.name}"`, 'success')
    }
  }

  // Playlist CRUD Operations
  const handleCreateOrEditPlaylist = ({ name, description }) => {
    if (playlistToEdit) {
      // Rename existing playlist
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistToEdit.id ? { ...p, name, description } : p
        )
      )
      showToast(`Playlist renamed to "${name}"`, 'success')
      setPlaylistToEdit(null)
    } else {
      // Create new playlist
      const newPlaylist = {
        id: `pl-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        songIds: []
      }
      setPlaylists((prev) => [newPlaylist, ...prev])
      setSelectedPlaylistId(newPlaylist.id)
      setActiveTab('playlist-detail')
      showToast(`Playlist "${name}" created!`, 'success')
    }
  }

  const handleDeletePlaylistConfirm = () => {
    if (!playlistToDelete) return
    const deletedName = playlistToDelete.name
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistToDelete.id))

    if (selectedPlaylistId === playlistToDelete.id) {
      const remaining = playlists.filter((p) => p.id !== playlistToDelete.id)
      setSelectedPlaylistId(remaining[0]?.id || null)
    }

    showToast(`Deleted playlist "${deletedName}"`, 'info')
    setPlaylistToDelete(null)
  }

  // Add song to playlist (strictly checking uniqueness)
  const handleAddSongToPlaylist = (playlistId, song) => {
    const targetPlaylist = playlists.find((p) => p.id === playlistId)
    if (!targetPlaylist) return

    if (targetPlaylist.songIds.includes(song.id)) {
      showToast(`"${song.title}" is already in "${targetPlaylist.name}"`, 'error')
      return
    }

    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, songIds: [...p.songIds, song.id] } : p
      )
    )
    showToast(`Added "${song.title}" to "${targetPlaylist.name}"`, 'success')
  }

  // Remove song from playlist
  const handleRemoveSongFromPlaylist = (playlistId, songId) => {
    const target = playlists.find((p) => p.id === playlistId)
    const song = songs.find((s) => s.id === songId)
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
          : p
      )
    )
    showToast(`Removed "${song?.title || 'Song'}" from "${target?.name || 'playlist'}"`, 'info')
  }

  // Reorder songs in playlist
  const handleReorderPlaylistSongs = (playlistId, newSongIds) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, songIds: newSongIds } : p))
    )
  }

  const activePlaylist = playlists.find((p) => p.id === selectedPlaylistId) || null

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col selection:bg-[#1ed760] selection:text-black">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onCreatePlaylistRequest={() => {
          setPlaylistToEdit(null)
          setIsPlaylistModalOpen(true)
        }}
        totalSongsCount={songs.length}
        totalPlaylistsCount={playlists.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {activeTab === 'library' && (
          <SongLibrary
            songs={songs}
            isLoading={isLoadingSongs}
            error={songsError}
            onRefresh={fetchSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={(song) => handlePlaySong(song, songs.map((s) => s.id))}
            onAddToPlaylist={(song) => {
              setSongToAddToPlaylist(song)
              setIsAddToPlaylistModalOpen(true)
            }}
            activePlaylist={activePlaylist}
          />
        )}

        {activeTab === 'playlists' && (
          <PlaylistsOverview
            playlists={playlists}
            songs={songs}
            selectedPlaylistId={selectedPlaylistId}
            onSelectPlaylist={(id) => {
              setSelectedPlaylistId(id)
              setActiveTab('playlist-detail')
            }}
            onPlayPlaylist={handlePlayEntirePlaylist}
            onRenamePlaylist={(pl) => {
              setPlaylistToEdit(pl)
              setIsPlaylistModalOpen(true)
            }}
            onDeletePlaylist={(pl) => {
              setPlaylistToDelete(pl)
              setIsConfirmModalOpen(true)
            }}
            onCreatePlaylistRequest={() => {
              setPlaylistToEdit(null)
              setIsPlaylistModalOpen(true)
            }}
          />
        )}

        {activeTab === 'playlist-detail' && (
          <PlaylistView
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onSelectPlaylist={(id) => setSelectedPlaylistId(id)}
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={(song) =>
              handlePlaySong(
                song,
                activePlaylist ? activePlaylist.songIds : []
              )
            }
            onPlayEntirePlaylist={handlePlayEntirePlaylist}
            onCreatePlaylistRequest={() => {
              setPlaylistToEdit(null)
              setIsPlaylistModalOpen(true)
            }}
            onRenamePlaylistRequest={(pl) => {
              setPlaylistToEdit(pl)
              setIsPlaylistModalOpen(true)
            }}
            onDeletePlaylistRequest={(pl) => {
              setPlaylistToDelete(pl)
              setIsConfirmModalOpen(true)
            }}
            onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
            onReorderPlaylistSongs={handleReorderPlaylistSongs}
            onNavigateToLibrary={() => setActiveTab('library')}
          />
        )}
      </main>

      {/* Persistent Now Playing Bar */}
      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextSong}
        onPrevious={handlePreviousSong}
        onSeek={handleSeek}
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={(val) => {
          setVolume(val)
          if (isMuted && val > 0) setIsMuted(false)
        }}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle((prev) => !prev)}
        isRepeat={isRepeat}
        onToggleRepeat={() => setIsRepeat((prev) => !prev)}
      />

      {/* Create / Rename Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false)
          setPlaylistToEdit(null)
        }}
        onSubmit={handleCreateOrEditPlaylist}
        existingPlaylists={playlists}
        playlistToEdit={playlistToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setPlaylistToDelete(null)
        }}
        onConfirm={handleDeletePlaylistConfirm}
        title="Delete Playlist"
        message={
          playlistToDelete
            ? `Are you sure you want to delete "${playlistToDelete.name}"? This will permanently remove the playlist from your device.`
            : 'Are you sure you want to delete this playlist?'
        }
        confirmText="Delete Playlist"
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => {
          setIsAddToPlaylistModalOpen(false)
          setSongToAddToPlaylist(null)
        }}
        song={songToAddToPlaylist}
        playlists={playlists}
        allSongs={songs}
        onAddToPlaylist={handleAddSongToPlaylist}
        onCreatePlaylistRequest={() => {
          setPlaylistToEdit(null)
          setIsPlaylistModalOpen(true)
        }}
      />

      {/* Floating Action Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
