import React, { useState, useEffect } from 'react'
import Modal from './common/Modal'
import Input from './common/Input'
import Button from './common/Button'

export default function PlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  existingPlaylists = [],
  playlistToEdit = null
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const isEditing = Boolean(playlistToEdit)

  useEffect(() => {
    if (isOpen) {
      if (playlistToEdit) {
        setName(playlistToEdit.name || '')
        setDescription(playlistToEdit.description || '')
      } else {
        setName('')
        setDescription('')
      }
      setError('')
    }
  }, [isOpen, playlistToEdit])

  const validate = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Playlist name is required')
      return false
    }

    // Check for uniqueness (case-insensitive)
    const isDuplicate = existingPlaylists.some(
      (p) =>
        p.name.trim().toLowerCase() === trimmed.toLowerCase() &&
        (!isEditing || p.id !== playlistToEdit.id)
    )

    if (isDuplicate) {
      setError('A playlist with this name already exists')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      name: name.trim(),
      description: description.trim()
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Rename Playlist' : 'Create New Playlist'}
      subtitle={
        isEditing
          ? 'Choose a fresh, unique name for your playlist'
          : 'Organize your favorite songs into a custom collection'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Playlist Name"
          placeholder="e.g. Late Night Lo-Fi, Workout Mix..."
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          onClear={() => setName('')}
          error={error}
          required
          autoFocus
          maxLength={40}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">
            Description <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add an optional mood, genre, or notes..."
            rows={2}
            maxLength={120}
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl p-3 text-sm border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 resize-none hover:border-slate-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80 mt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Playlist'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
