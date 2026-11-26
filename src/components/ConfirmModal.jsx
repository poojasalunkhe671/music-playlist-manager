import React from 'react'
import Modal from './common/Modal'
import Button from './common/Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Playlist',
  message = 'Are you sure you want to delete this playlist? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
          {message}
        </p>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-5 text-xs sm:text-sm whitespace-nowrap"
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-5 text-xs sm:text-sm whitespace-nowrap"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
