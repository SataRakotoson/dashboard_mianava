import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            // Base styles
            'block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm',
            'bg-white text-gray-900 placeholder-gray-500',
            'transition-colors duration-200',
            // Focus states
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            // Hover states
            'hover:border-gray-400',
            // Disabled states
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200',
            // Error states
            error && 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
