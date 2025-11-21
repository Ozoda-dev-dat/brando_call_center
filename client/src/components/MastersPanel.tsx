import { Search, UserCheck, Phone, Star, TrendingUp, AlertTriangle, Award, Clock, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMasters } from '@/data/mockData';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import type { MasterStatus } from '@shared/crm-schema';

const statusLabels: Record<MasterStatus, string> = {
  active: 'Faol',
  busy: 'Band',
  offline: 'Offline',
  suspended: 'To\'xtatilgan'
};

const statusColors: Record<MasterStatus, string> = {
  active: 'bg-green-100 text-green-700',
  busy: 'bg-yellow-100 text-yellow-700',
  offline: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700'
};

export function MastersPanel() {
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Ustalar</h1>
          {user?.role === 'admin' && (
            <Badge variant="outline" className="border-purple-500 text-purple-700">
              <Shield className="w-3 h-3 mr-1" />
              Admin Boshqaruvi
            </Badge>
          )}
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

        <div className="grid gap-4">
          {mockMasters.map((master) => (
            <Card key={master.id} className="p-6 hover-elevate cursor-pointer" data-testid={`master-card-${master.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{master.name}</h3>
                      <Badge className={statusColors[master.status]} data-testid={`badge-status-${master.id}`}>
                        {statusLabels[master.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Kod: {master.code}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{master.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">{master.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900" data-testid={`master-completed-${master.id}`}>{master.completedJobs}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Bajarilgan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{master.activeJobs}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Faol</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Award className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600" data-testid={`master-honesty-${master.id}`}>{master.honestyScore}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Haliqlik</p>
                </div>
                <div className="text-center">
                  <div className={`flex items-center justify-center gap-1 ${master.penaltyPoints > 5 ? 'text-red-600' : 'text-gray-900'}`}>
                    {master.penaltyPoints > 5 && <AlertTriangle className="w-5 h-5" />}
                    <p className="text-2xl font-bold">{master.penaltyPoints}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Jarima Ball</p>
                </div>
              </div>

              {master.fraudAlerts > 0 && (
                <div className="mb-4 bg-red-50 border-2 border-red-600 p-4 rounded-lg" data-testid={`fraud-alert-master-${master.id}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-900">
                      {master.fraudAlerts} ta firibgarlik ogohlantirishis
                    </p>
                  </div>
                  <p className="text-xs text-red-700 mt-2">Diqqat bilan ko'rib chiqing!</p>
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

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ixtisoslashuv</p>
                  <div className="flex flex-wrap gap-1">
                    {master.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tuman</p>
                  <p className="text-sm font-medium text-gray-900">{master.district}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ishlagan vaqti</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(master.joinedDate).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">O'rtacha javob:</span>
                  <span className="font-medium text-gray-900">{master.avgResponseTime} daq</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">O'rtacha bajarish:</span>
                  <span className="font-medium text-gray-900">{master.avgCompletionTime} daq</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
