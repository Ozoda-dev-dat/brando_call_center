import { MapPin, Phone, Mail, Users, Clock, User, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockServiceCenters } from '@/data/mockData';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';

export function ServiceCentersPanel() {
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;

  
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Xizmat Markazlari</h1>
            {user?.role === 'admin' && (
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Filiallar va qamrov hududlari</p>
        </div>
        {permissions?.canManageServiceCenters && (
          <Button className="gap-2" data-testid="button-create-center">
            <MapPin className="w-4 h-4" />
            Yangi Markaz Qo'shish
          </Button>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {mockServiceCenters.map((center) => (
            <Card key={center.id} className="p-6 hover-elevate cursor-pointer" data-testid={`center-card-${center.id}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{center.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{center.district} tumani</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  {center.activeMasters} faol usta
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Manzil</p>
                      <p className="text-sm text-gray-900">{center.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telefon</p>
                      <p className="text-sm text-gray-900">{center.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm text-gray-900">{center.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ish vaqti</p>
                      <p className="text-sm text-gray-900">{center.workingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Menejer</p>
                      <p className="text-sm text-gray-900">{center.manager}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Qamrov hududlari</p>
                <div className="flex flex-wrap gap-2">
                  {center.coverageArea.map((area) => (
                    <Badge key={area} variant="outline" className="text-sm">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
