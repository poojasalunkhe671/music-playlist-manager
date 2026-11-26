const STORAGE_KEY = 'mupm_playlists_v2'

export const DEFAULT_PLAYLISTS = [
  {
    id: 'pl-1',
    name: 'Synthwave Drive',
    description: 'High energy retro synths and neon highways.',
    createdAt: new Date().toISOString(),
    songIds: ['song-1', 'song-3', 'song-6', 'song-16']
  },
  {
    id: 'pl-2',
    name: 'Midnight Lo-Fi & Chill',
    description: 'Mellow beats for late night coding and relaxation.',
    createdAt: new Date().toISOString(),
    songIds: ['song-2', 'song-10', 'song-13']
  }
]

/**
 * Load playlists from localStorage
 * Returns default starter playlists if none exist
 */
export function getSavedPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      savePlaylists(DEFAULT_PLAYLISTS)
      return DEFAULT_PLAYLISTS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed
    }
    return DEFAULT_PLAYLISTS
  } catch (err) {
    console.error('Failed to parse playlists from localStorage:', err)
    return DEFAULT_PLAYLISTS
  }
}

/**
 * Save playlists array to localStorage
 * @param {Array} playlists
 */
export function savePlaylists(playlists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  } catch (err) {
    console.error('Failed to save playlists to localStorage:', err)
  }
}
