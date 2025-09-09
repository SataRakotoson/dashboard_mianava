'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline'

interface AutocompleteOption {
  id: string
  name: string
}

interface AutocompleteProps {
  label: string
  placeholder: string
  options: AutocompleteOption[]
  value: string
  onChange: (value: string) => void
  onCreateNew?: (name: string) => Promise<{ id: string; name: string } | null>
  required?: boolean
  className?: string
  createNewLabel?: string
}

export function Autocomplete({
  label,
  placeholder,
  options,
  value,
  onChange,
  onCreateNew,
  required = false,
  className = '',
  createNewLabel = 'Créer'
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [creating, setCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Trouver l'option sélectionnée
  const selectedOption = options.find(option => option.id === value)
  
  // Filtrer les options selon le terme de recherche
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Gérer les clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gérer les touches du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        setIsOpen(true)
        setHighlightedIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 + (onCreateNew && searchTerm ? 1 : 0) ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          if (highlightedIndex < filteredOptions.length) {
            // Sélectionner une option existante
            handleSelectOption(filteredOptions[highlightedIndex])
          } else if (onCreateNew && searchTerm) {
            // Créer une nouvelle option
            handleCreateNew()
          }
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
        break
    }
  }

  const handleSelectOption = (option: AutocompleteOption) => {
    onChange(option.id)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const handleCreateNew = async () => {
    if (!onCreateNew || !searchTerm.trim() || creating) return

    setCreating(true)
    try {
      const newOption = await onCreateNew(searchTerm.trim())
      if (newOption) {
        onChange(newOption.id)
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setIsOpen(true)
    setHighlightedIndex(0)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    if (filteredOptions.length > 0) {
      setHighlightedIndex(0)
    }
  }

  const displayValue = isOpen ? searchTerm : (selectedOption?.name || '')

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10 text-black p-2"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          required={required}
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {selectedOption && !isOpen && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setSearchTerm('')
              }}
              className="px-1 text-gray-400 hover:text-gray-600"
              title="Effacer la sélection"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3"
          >
            <ChevronDownIcon 
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 && !searchTerm ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Aucune option disponible
            </div>
          ) : filteredOptions.length === 0 && searchTerm ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Aucun résultat pour "{searchTerm}"
            </div>
          ) : null}
          
          {filteredOptions.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${
                index === highlightedIndex ? 'bg-gray-50' : ''
              } ${option.id === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
            >
              <span>{option.name}</span>
              {option.id === value && (
                <CheckIcon className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
          
          {onCreateNew && searchTerm && !filteredOptions.some(opt => 
            opt.name.toLowerCase() === searchTerm.toLowerCase()
          ) && (
            <button
              type="button"
              onClick={handleCreateNew}
              disabled={creating}
              className={`w-full px-3 py-2 text-left text-sm flex items-center text-blue-600 hover:bg-blue-50 border-t border-gray-200 ${
                filteredOptions.length === highlightedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {creating ? 'Création...' : `${createNewLabel} "${searchTerm}"`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
