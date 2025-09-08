import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  ChartBarIcon,
  CubeIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Produits',
    value: '1,248',
    change: '+12.5%',
    changeType: 'positive',
    icon: CubeIcon,
  },
  {
    name: 'Catégories',
    value: '24',
    change: '+2',
    changeType: 'positive',
    icon: TagIcon,
  },
  {
    name: 'Utilisateurs',
    value: '856',
    change: '+18.2%',
    changeType: 'positive',
    icon: UserGroupIcon,
  },
  {
    name: 'Stock Total',
    value: '12,847',
    change: '-3.1%',
    changeType: 'negative',
    icon: ChartBarIcon,
  },
]

const recentActivity = [
  {
    id: '1',
    action: 'Nouveau produit ajouté',
    user: 'Admin',
    item: 'Robe d\'été Zara',
    status: 'Créé',
    date: '2024-12-01',
  },
  {
    id: '2',
    action: 'Stock mis à jour',
    user: 'Manager',
    item: 'Parfum Chanel N°5',
    status: 'Modifié',
    date: '2024-12-01',
  },
  {
    id: '3',
    action: 'Catégorie créée',
    user: 'Admin',
    item: 'Accessoires d\'hiver',
    status: 'Créé',
    date: '2024-11-30',
  },
  {
    id: '4',
    action: 'Utilisateur ajouté',
    user: 'Admin',
    item: 'Pierre Durand',
    status: 'Actif',
    date: '2024-11-30',
  },
]

const lowStockProducts = [
  {
    name: 'Robe d\'été Zara',
    stock: 5,
    threshold: 10,
    category: 'Vêtements',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=50&h=50&fit=crop&crop=center',
  },
  {
    name: 'Parfum Chanel N°5',
    stock: 3,
    threshold: 15,
    category: 'Parfums',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=50&h=50&fit=crop&crop=center',
  },
  {
    name: 'Sneakers Nike Air',
    stock: 2,
    threshold: 8,
    category: 'Chaussures',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop&crop=center',
  },
  {
    name: 'Sac à main Hermès',
    stock: 1,
    threshold: 5,
    category: 'Accessoires',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=50&h=50&fit=crop&crop=center',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vue d\'ensemble</h2>
        <p className="text-gray-600">Tableau de bord pour la gestion de votre inventaire et données.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} padding="md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élément
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Produits en stock faible */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes stock faible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{product.stock} en stock</p>
                    <p className="text-xs text-gray-500">Seuil: {product.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
