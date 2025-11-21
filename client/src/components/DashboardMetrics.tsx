import { AlertTriangle, TrendingUp, Clock, Award, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockFraudAlerts } from '@/data/mockData';

export function DashboardMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bugungi Buyurtmalar</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="metric-today-tickets">48</p>
          <p className="text-xs text-green-600 mt-2">+12% kechagidan</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Faol Ishlar</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="metric-active-jobs">14</p>
          <p className="text-xs text-gray-500 mt-2">3 ta kritik SLA</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">O'rtacha Haliqlik</p>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="metric-honesty-score">94</p>
          <p className="text-xs text-green-600 mt-2">Yaxshi ko'rsatkich</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-red-700 uppercase tracking-wide font-medium">Firibgarlik Ogohlantirishlari</p>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700" data-testid="metric-fraud-alerts">{mockFraudAlerts.length}</p>
          <p className="text-xs text-red-600 mt-2">Zudlik bilan ko'rib chiqing!</p>
        </Card>
      </div>

      <Card className="p-6 bg-red-50 border-2 border-red-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Firibgarlik Ogohlantirishlari
          </h3>
          <Badge variant="destructive" data-testid="badge-fraud-count">
            {mockFraudAlerts.filter(a => !a.resolved).length} ta hal qilinmagan
          </Badge>
        </div>

        <div className="space-y-3">
          {mockFraudAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg"
              data-testid={`fraud-alert-${alert.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {alert.severity === 'critical' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-red-900">{alert.issue}</p>
                      <Badge 
                        variant="destructive" 
                        className="text-[10px] px-2 py-0"
                        data-testid={`badge-severity-${alert.severity}`}
                      >
                        {alert.severity === 'critical' ? 'KRITIK' : alert.severity === 'high' ? 'YUQORI' : 'O\'RTA'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Buyurtma: <span className="font-medium">{alert.ticketNumber}</span> • 
                      Usta: <span className="font-medium">{alert.masterName}</span>
                    </p>
                    {alert.details && (
                      <p className="text-sm text-red-700 mt-2 bg-red-100 rounded px-2 py-1">
                        {alert.details}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(alert.detectedAt).toLocaleTimeString('uz-UZ', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">SLA Vaqt Hisobi</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">TK-2024-1830</span>
                <span className="text-red-600 font-medium">08:45</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">TK-2024-1829</span>
                <span className="text-yellow-600 font-medium">12:30</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">TK-2024-1828</span>
                <span className="text-green-600 font-medium">18:20</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <h4 className="text-sm font-medium text-red-700 mb-4">Jarima Ballari</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Kamol Ergashev</span>
              <Badge variant="destructive" className="text-xs" data-testid="penalty-points-ms051">
                8 ball
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Jasur Toshmatov</span>
              <Badge variant="destructive" className="text-xs" data-testid="penalty-points-ms042">
                3 ball
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Bobur Alimov</span>
              <Badge className="text-xs bg-green-100 text-green-700" data-testid="penalty-points-ms038">
                0 ball
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Bugungi Natijalar</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tugatilgan</span>
              <span className="text-lg font-bold text-green-600">36</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Jarayonda</span>
              <span className="text-lg font-bold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Kutilmoqda</span>
              <span className="text-lg font-bold text-gray-600">8</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
