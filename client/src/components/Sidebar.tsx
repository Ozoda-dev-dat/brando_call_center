import { FileText, Users, MapPin, UserCheck, LayoutDashboard, Settings, FileBarChart, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';

const menuItems = [
  { id: 'tickets', label: 'Buyurtmalar', icon: FileText, path: '/', roles: ['admin', 'operator'] },
  { id: 'customers', label: 'Mijozlar', icon: Users, path: '/customers', roles: ['admin', 'operator'] },
  { id: 'service-centers', label: 'Xizmat Markazlari', icon: MapPin, path: '/service-centers', roles: ['admin', 'operator'] },
  { id: 'masters', label: 'Ustalar', icon: UserCheck, path: '/masters', roles: ['admin', 'operator', 'master'] },
  { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'operator'] },
  { id: 'reports', label: 'Hisobotlar', icon: FileBarChart, path: '/reports', roles: ['admin', 'operator'] },
  { id: 'admin', label: 'Admin', icon: Settings, path: '/admin', roles: ['admin'] }
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const visibleMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

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
        {visibleMenuItems.map((item) => {
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
        <div className="mb-3" data-testid="user-info">
          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2" 
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Chiqish
        </Button>
      </div>
    </div>
  );
}
