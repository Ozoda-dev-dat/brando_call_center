import { AlertTriangle, XCircle, Clock, MapPin, Camera, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockFraudAlerts } from '@/data/mockData';

const typeIcons = {
  missing_photos: Camera,
  warranty_violation: Award,
  distance_mismatch: MapPin,
  time_violation: Clock
};

export function FraudAlertsColumn() {
  const activeAlerts = mockFraudAlerts.filter(a => !a.resolved);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Firibgarlik Ogohlantirishlari
        </h3>
        <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full" data-testid="badge-active-fraud-count">
          {activeAlerts.length} faol
        </span>
      </div>

      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          return (
            <Card 
              key={alert.id} 
              className="p-4 bg-red-50 border-2 border-red-600"
              data-testid={`fraud-alert-card-${alert.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">{alert.title}</p>
                    <p className="text-xs text-red-700 mt-1">{alert.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Buyurtma:</span>
                  <span className="font-medium text-red-900" data-testid={`alert-ticket-${alert.id}`}>
                    {alert.ticketNumber}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Usta:</span>
                  <span className="font-medium text-red-900">{alert.masterName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Xavflilik:</span>
                  <span 
                    className={`text-xs font-medium px-2 py-0.5 rounded ${alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    data-testid={`alert-severity-${alert.id}`}
                  >
                    {alert.severity === 'high' ? 'Yuqori' : alert.severity === 'medium' ? 'O\'rta' : 'Past'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Vaqt:</span>
                  <span className="font-medium text-red-900" data-testid={`alert-time-${alert.id}`}>
                    {new Date(alert.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex-1 text-xs"
                  data-testid={`button-review-alert-${alert.id}`}
                >
                  Ko'rib Chiqish
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs border-red-600 text-red-700 hover:bg-red-100"
                  data-testid={`button-resolve-alert-${alert.id}`}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Yopish
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-white border-2 border-gray-300">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Ogohlantirishlar Statistikasi</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bugun aniqlangan:</span>
            <span className="font-bold text-gray-900" data-testid="stat-fraud-today">{mockFraudAlerts.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hal qilingan:</span>
            <span className="font-bold text-green-600" data-testid="stat-fraud-resolved">
              {mockFraudAlerts.filter(a => a.resolved).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Faol:</span>
            <span className="font-bold text-red-600" data-testid="stat-fraud-active">{activeAlerts.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
