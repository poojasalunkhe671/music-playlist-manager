/**
 * Format seconds into mm:ss format
 * @param {number} seconds
 * @returns {string} e.g. "03:45"
 */
export function formatDuration(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format total playlist duration into human readable string
 * e.g. "8 songs · 32 min" or "1 song · 3 min 45 sec" or "2 hr 15 min"
 * @param {number} songCount
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatPlaylistDetails(songCount, totalSeconds) {
  const songsLabel = songCount === 1 ? '1 song' : `${songCount} songs`
  
  if (songCount === 0 || totalSeconds === 0) {
    return `${songsLabel} · 0 min`
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let timeString = ''
  if (hours > 0) {
    timeString = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`
  } else if (minutes > 0) {
    timeString = `${minutes} min${minutes < 5 && seconds > 0 ? ` ${seconds}s` : ''}`
  } else {
    timeString = `${seconds} sec`
  }

  return `${songsLabel} · ${timeString}`
}
