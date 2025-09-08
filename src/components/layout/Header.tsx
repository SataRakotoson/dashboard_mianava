'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Barre de recherche */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">Voir les notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Menu utilisateur */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{user?.fullName || user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <UserIcon className="h-4 w-4 inline mr-2" />
                        Mon profil
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={clsx(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                        Se déconnecter
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}
