import { Search, UserCheck, Phone, MapPin } from 'lucide-react';
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

  const { data: masters = [], isLoading, error } = useQuery<Master[]>({
    queryKey: ['/api/masters'],
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Xatolik: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Ustalar</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Usta ishlari va ko'rsatkichlar</p>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Usta kodi, ismi yoki telefon bo'yicha qidirish..."
                className="pl-10"
                data-testid="input-search-masters"
              />
            </div>
            {permissions?.canManageMasters && (
              <Button className="gap-2" data-testid="button-create-master">
                <UserCheck className="w-4 h-4" />
                Yangi Usta Qo'shish
              </Button>
            )}
          </div>
        </Card>

        {masters.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Ustalar topilmadi</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {masters.map((master) => (
              <Card key={master.id} className="p-6 hover-elevate cursor-pointer" data-testid={`master-card-${master.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{master.name || 'Noma\'lum'}</h3>
                        <Badge className="bg-green-100 text-green-700">
                          Faol
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">ID: {master.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{master.phone || 'Telefon yo\'q'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telegram ID</p>
                    <p className="text-sm font-medium text-gray-900">{master.telegramId || 'Bog\'lanmagan'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hudud</p>
                    <p className="text-sm font-medium text-gray-900">{master.region || 'Belgilanmagan'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Oxirgi joylashuv yangilandi</p>
                    <p className="text-sm font-medium text-gray-900">
                      {master.lastLocationUpdate 
                        ? new Date(master.lastLocationUpdate).toLocaleString('uz-UZ')
                        : 'Ma\'lumot yo\'q'}
                    </p>
                  </div>
                </div>

                {(master.lastLat || master.lastLng) && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Joylashuv: {master.lastLat}, {master.lastLng}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-master-${master.id}`}>
                    Profilni Ko'rish
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" data-testid={`button-assign-master-${master.id}`}>
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
