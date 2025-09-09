'use client'

import { CheckIcon } from '@heroicons/react/24/outline'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  description?: string
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  description
}: CheckboxProps) {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          id={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <label
          htmlFor={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`
            relative w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200
            ${checked 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-white border-gray-300 hover:border-gray-400'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-sm'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          {checked && (
            <CheckIcon className="absolute inset-0 w-3 h-3 text-white m-auto" strokeWidth={3} />
          )}
        </label>
      </div>
      <div className="ml-3">
        <label
          htmlFor={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`
            text-sm font-medium cursor-pointer
            ${disabled ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          {label}
        </label>
        {description && (
          <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
