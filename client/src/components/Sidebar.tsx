import { FileText, Users, MapPin, UserCheck, LayoutDashboard, Settings, FileBarChart, LogOut, Phone, Factory, Wrench, Building2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';

const menuItems = [
  { id: 'tickets', label: 'Buyurtmalar', icon: FileText, path: '/', roles: ['admin', 'operator'], color: 'blue' },
  { id: 'calls', label: "Qo'ng'iroqlar", icon: Phone, path: '/calls', roles: ['admin', 'operator'], color: 'green' },
  { id: 'customers', label: 'Mijozlar', icon: Users, path: '/customers', roles: ['admin', 'operator'], color: 'purple' },
  { id: 'service-centers', label: 'Serviz Markazlari', icon: Building2, path: '/service-centers', roles: ['admin', 'operator'], color: 'orange' },
  { id: 'masters', label: 'Texniklar', icon: Wrench, path: '/masters', roles: ['admin', 'operator', 'master'], color: 'cyan' },
  { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'operator'], color: 'indigo' },
  { id: 'reports', label: 'Hisobotlar', icon: FileBarChart, path: '/reports', roles: ['admin', 'operator'], color: 'pink' },
  { id: 'admin', label: 'Sozlamalar', icon: Settings, path: '/admin', roles: ['admin'], color: 'red' }
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
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Zavod CRM</h1>
            <p className="text-xs text-slate-400">Ishlab Chiqarish Tizimi</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === '/' && location === '/tickets');
          
          return (
            <Link
              key={item.id}
              href={item.path}
              data-testid={`link-nav-${item.id}`}
            >
              <div
                className={`flex items-center gap-3 h-11 px-4 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isActive 
                    ? 'bg-white/15 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-white/20' : 'group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0" data-testid="user-info">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <ThemeToggle />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-2 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all duration-200" 
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
