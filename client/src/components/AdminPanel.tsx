import { Users, Shield, Activity, Settings, Database, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAdminUsers } from '@/data/mockData';

export function AdminPanel() {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Paneli</h1>
        <p className="text-sm text-gray-500 mt-1">Tizim sozlamalari va foydalanuvchilar</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Foydalanuvchilar</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockAdminUsers.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {mockAdminUsers.filter(u => u.active).length} faol
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Xavfsizlik</p>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">Yaxshi</p>
            <p className="text-sm text-gray-500 mt-2">Hech qanday xavf yo'q</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tizim Holati</p>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">Faol</p>
            <p className="text-sm text-gray-500 mt-2">99.8% uptime</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ma'lumotlar Bazasi</p>
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">84%</p>
            <p className="text-sm text-gray-500 mt-2">Joy to'ldirilganligi</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Foydalanuvchilar</h3>
              <Button size="sm" data-testid="button-create-user">
                Yangi Foydalanuvchi
              </Button>
            </div>

            <div className="space-y-3">
              {mockAdminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-elevate cursor-pointer"
                  data-testid={`user-row-${user.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'default'
                          : user.role === 'supervisor'
                          ? 'secondary'
                          : 'outline'
                      }
                      data-testid={`badge-role-${user.id}`}
                    >
                      {user.role === 'admin' ? 'Admin' : user.role === 'supervisor' ? 'Nazoratchi' : 'Operator'}
                    </Badge>
                    {user.active ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tizim Audit Logi</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Foydalanuvchi kirdi</p>
                  <p className="text-xs text-gray-500">Nigora Sharipova • 09:15</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sozlamalar o'zgartirildi</p>
                  <p className="text-xs text-gray-500">Dilshod Mahmudov • 08:30</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Xatolik yuz berdi</p>
                  <p className="text-xs text-red-600">Tizim loglari • 07:45</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ma'lumotlar zaxiralandi</p>
                  <p className="text-xs text-gray-500">Avtomatik • 06:00</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Xavfsizlik Sozlamalari
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">2-faktorli autentifikatsiya</span>
                <Badge className="bg-green-100 text-green-700">Yoqilgan</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SSL sertifikati</span>
                <Badge className="bg-green-100 text-green-700">Faol</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Parol murakkabligi</span>
                <Badge className="bg-green-100 text-green-700">Yuqori</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Ma'lumotlar Bazasi
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Oxirgi zaxira</span>
                <span className="text-sm font-medium text-gray-900">Bugun 06:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hajmi</span>
                <span className="text-sm font-medium text-gray-900">2.4 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Yozuvlar soni</span>
                <span className="text-sm font-medium text-gray-900">45,832</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Tizim Sozlamalari
            </h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-general-settings">
                Umumiy sozlamalar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-notification-settings">
                Bildirishnomalar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-integration-settings">
                Integratsiyalar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
