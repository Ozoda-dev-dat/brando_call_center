import { FileText, Users, LayoutDashboard, Settings, FileBarChart, LogOut, Phone, Wrench, Building2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import brandoLogo from '@assets/image_1765915500786.png';

const menuItems = [
  { id: 'tickets', label: 'Buyurtmalar', icon: FileText, path: '/', roles: ['admin', 'operator'] },
  { id: 'calls', label: "Qo'ng'iroqlar", icon: Phone, path: '/calls', roles: ['admin', 'operator'] },
  { id: 'customers', label: 'Mijozlar', icon: Users, path: '/customers', roles: ['admin', 'operator'] },
  { id: 'service-centers', label: 'Serviz Markazlari', icon: Building2, path: '/service-centers', roles: ['admin', 'operator'] },
  { id: 'masters', label: 'Texniklar', icon: Wrench, path: '/masters', roles: ['admin', 'operator', 'master'] },
  { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'operator'] },
  { id: 'reports', label: 'Hisobotlar', icon: FileBarChart, path: '/reports', roles: ['admin', 'operator'] },
  { id: 'admin', label: 'Sozlamalar', icon: Settings, path: '/admin', roles: ['admin'] }
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
    <div className="w-64 bg-slate-950 h-screen flex flex-col border-r border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src={brandoLogo} alt="Brando" className="h-8" />
        </div>
        <p className="text-xs text-slate-500 mt-2 ml-1">CallCenter CRM</p>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === '/' && location === '/tickets');
          
          return (
            <Link
              key={item.id}
              href={item.path}
              data-testid={`link-nav-${item.id}`}
            >
              <div
                className={`flex items-center gap-3 h-10 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-slate-900/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold text-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0" data-testid="user-info">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <ThemeToggle />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-2 text-slate-500 hover:text-white hover:bg-red-600/20 transition-all duration-200" 
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
