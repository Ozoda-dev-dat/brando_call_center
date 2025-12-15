import { useState } from 'react';
import { Search, UserCheck, Phone, MapPin, Star, Clock, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import { useQuery } from '@tanstack/react-query';
import type { Master } from '@shared/schema';

export function MastersPanel() {
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: masters = [], isLoading, error } = useQuery<Master[]>({
    queryKey: ['/api/masters'],
  });

  const filteredMasters = masters.filter(master => {
    const query = searchQuery.toLowerCase();
    return (
      master.name?.toLowerCase().includes(query) ||
      master.phone?.toLowerCase().includes(query) ||
      master.region?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-red-50/30 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Xatolik: {(error as Error).message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-auto">
      <div className="page-header flex items-center justify-between">
        <div className="slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="page-title text-2xl font-bold text-gray-900">Ustalar</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">Usta ishlari va ko'rsatkichlar</p>
        </div>
        {permissions?.canManageMasters && (
          <Button className="gap-2 action-button gradient-bg text-white border-0" data-testid="button-create-master">
            <UserCheck className="w-4 h-4" />
            Yangi Usta Qo'shish
          </Button>
        )}
      </div>

      <div className="p-6 fade-in">
        <Card className="p-4 mb-6 glass-card border-0 shadow-sm">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Usta kodi, ismi yoki telefon bo'yicha qidirish..."
                className="pl-10 search-input bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-masters"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Jami Ustalar</p>
                <p className="text-3xl font-bold text-gray-900">{masters.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Faol Ustalar</p>
                <p className="text-3xl font-bold text-green-600">{masters.filter(m => m.lastLocationUpdate).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Hududlar</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(masters.map(m => m.region).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {filteredMasters.length === 0 ? (
          <Card className="p-12 text-center glass-card border-0">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Ustalar topilmadi</p>
            <p className="text-gray-400 text-sm mt-1">Qidiruv so'rovingizni o'zgartiring</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMasters.map((master, index) => (
              <Card 
                key={master.id} 
                className="p-6 list-item cursor-pointer bg-white border hover:border-blue-200 transition-all duration-300" 
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`master-card-${master.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {master.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{master.name || 'Noma\'lum'}</h3>
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-sm">
                          Faol
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        ID: {master.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{master.phone || 'Telefon yo\'q'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telegram ID</p>
                    <p className="text-sm font-semibold text-gray-900">{master.telegramId || 'Bog\'lanmagan'}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hudud</p>
                    <p className="text-sm font-semibold text-gray-900">{master.region || 'Belgilanmagan'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Oxirgi faollik</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {master.lastLocationUpdate 
                        ? new Date(master.lastLocationUpdate).toLocaleDateString('uz-UZ')
                        : 'Ma\'lumot yo\'q'}
                    </p>
                  </div>
                </div>

                {(master.lastLat || master.lastLng) && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Joylashuv: {master.lastLat}, {master.lastLng}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button size="sm" variant="outline" className="flex-1 action-button hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700" data-testid={`button-view-master-${master.id}`}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Profilni Ko'rish
                  </Button>
                  <Button size="sm" className="flex-1 action-button gradient-bg text-white border-0" data-testid={`button-assign-master-${master.id}`}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Buyurtma Biriktirish
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
