'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  CubeIcon,
  GiftIcon,
  TruckIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Vue d\'ensemble', href: '/admin', icon: HomeIcon },
  { name: 'Produits', href: '/admin/products', icon: CubeIcon },
  { name: 'Catégories', href: '/admin/categories', icon: TagIcon },
  { name: 'Marques', href: '/admin/brands', icon: BuildingStorefrontIcon },
  { name: 'Inventaire', href: '/admin/inventory', icon: ShoppingBagIcon },
  { name: 'Utilisateurs', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Paramètres', href: '/admin/settings', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-lg font-semibold text-gray-900">Mianava</p>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                isActive
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center pl-3 pr-2 py-2 border-l-4 text-sm font-medium transition-colors'
              )}
            >
              <item.icon
                className={clsx(
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
