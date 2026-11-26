import React from 'react'
import { X } from 'lucide-react'

export default function Input({
  label,
  value,
  onChange,
  onClear,
  placeholder = '',
  type = 'text',
  error = '',
  icon = null,
  className = '',
  inputClassName = '',
  required = false,
  autoFocus = false,
  maxLength,
  ...props
}) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#b3b3b3] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-400 ml-1">*</span>}
          </span>
          {maxLength && (
            <span className="text-[11px] text-[#727272]">
              {String(value || '').length}/{maxLength}
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-[#b3b3b3] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`w-full bg-[#242424] text-white placeholder-[#727272] rounded-full px-4 py-2.5 text-sm border transition-all duration-200 outline-none
            ${icon ? 'pl-10' : ''}
            ${onClear && value ? 'pr-9' : ''}
            ${
              error
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-transparent focus:border-white/30 focus:bg-[#2a2a2a] hover:bg-[#2a2a2a]'
            }
            ${inputClassName}
          `}
          {...props}
        />

        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3.5 text-[#b3b3b3] hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
            title="Clear input"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-fadeIn">
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
