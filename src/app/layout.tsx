import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mianava - Dashboard Administration',
  description: 'Dashboard d\'administration pour la gestion de produits, commandes et clients',
  keywords: 'dashboard, administration, gestion, produits, commandes, clients',
  authors: [{ name: 'Mianava Team' }],
  openGraph: {
    title: 'Mianava - Dashboard Administration',
    description: 'Dashboard d\'administration pour la gestion complète',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}