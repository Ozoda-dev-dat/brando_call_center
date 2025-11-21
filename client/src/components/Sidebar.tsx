import { Headphones, FileText, Users, MapPin, UserCheck, LayoutDashboard, Settings, FileBarChart } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';

const menuItems = [
  { id: 'operator', label: 'Operator', icon: Headphones, path: '/' },
  { id: 'tickets', label: 'Buyurtmalar', icon: FileText, path: '/tickets' },
  { id: 'customers', label: 'Mijozlar', icon: Users, path: '/customers' },
  { id: 'service-centers', label: 'Xizmat Markazlari', icon: MapPin, path: '/service-centers' },
  { id: 'masters', label: 'Ustalar', icon: UserCheck, path: '/masters' },
  { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'reports', label: 'Hisobotlar', icon: FileBarChart, path: '/reports' },
  { id: 'admin', label: 'Admin', icon: Settings, path: '/admin' }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold text-gray-900">Brando CRM</h1>
          <ThemeToggle />
        </div>
        <p className="text-xs text-gray-500">Qo'ng'iroqlar Markazi</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link
              key={item.id}
              href={item.path}
              data-testid={`link-nav-${item.id}`}
            >
              <div
                className={`flex items-center gap-3 h-10 px-3 rounded-md transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-l-none' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500" data-testid="operator-info">
          <p>Operator: Nigora Sharipova</p>
          <p className="mt-1">Faol vaqt: 2:34:18</p>
        </div>
      </div>
    </div>
  );
}
