import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .trim()
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round((1 - salePrice / originalPrice) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}

export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const timestamp = Date.now().toString().slice(-4)
  
  return `MN${year}${month}${day}${timestamp}`
}

export function calculateShipping(totalAmount: number, country = 'FR'): number {
  if (totalAmount >= 50) return 0 // Livraison gratuite dès 50€
  
  switch (country) {
    case 'FR':
      return 5.99
    case 'BE':
    case 'LU':
    case 'MC':
      return 8.99
    case 'CH':
      return 12.99
    default:
      return 15.99
  }
}

export function calculateTax(amount: number, rate = 0.2): number {
  return amount * rate
}

export function getImageUrl(imagePath: string | null | undefined, fallback = '/images/placeholder.jpg'): string {
  if (!imagePath) return fallback
  if (imagePath.startsWith('http')) return imagePath
  return `/images/${imagePath}`
}

export function createSearchParams(params: Record<string, string | number | boolean | null | undefined>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

export function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {}
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}
