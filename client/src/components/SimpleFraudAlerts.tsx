import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockFraudAlerts, mockMasters } from '@/data/mockData';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';

export function SimpleFraudAlerts() {
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;

  let filteredAlerts = mockFraudAlerts.filter(a => !a.resolved);

  if (permissions?.canViewOwnFraudAlertsOnly) {
    // TODO: In production, user object should include masterId field from database
    // For now, using mock data with fixed master ID for demonstration
    // Production implementation would use: user.masterId
    const currentMaster = mockMasters.find(m => m.code === 'MS-042');
    if (currentMaster) {
      filteredAlerts = filteredAlerts.filter(a => a.masterId === currentMaster.id);
    } else {
      filteredAlerts = [];
    }
  }

  const activeAlerts = filteredAlerts;

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

      {permissions?.canViewFraudAlertsAsWarning && (
        <Card className="p-3 bg-yellow-50 border-yellow-300">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Operator sifatida bu ogohlantirishlarni faqat ko'rishingiz mumkin. Admin harakatlar amalga oshiradi.
            </p>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          return (
            <Card 
              key={alert.id} 
              className="p-4 bg-red-50 border-2 border-red-600"
              data-testid={`fraud-alert-card-${alert.id}`}
            >
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">{alert.issue}</p>
                  {alert.details && <p className="text-xs text-red-700 mt-1">{alert.details}</p>}
                </div>
              </div>

              <div className="space-y-2 mb-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-600">Buyurtma:</span>
                  <span className="font-medium text-red-900" data-testid={`alert-ticket-${alert.id}`}>
                    {alert.ticketNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Usta:</span>
                  <span className="font-medium text-red-900">{alert.masterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Xavflilik:</span>
                  <span 
                    className={`font-medium px-2 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-red-600 text-white' : alert.severity === 'high' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    data-testid={`alert-severity-${alert.id}`}
                  >
                    {alert.severity === 'critical' ? 'Juda Yuqori' : alert.severity === 'high' ? 'Yuqori' : alert.severity === 'medium' ? 'O\'rta' : 'Past'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Vaqt:</span>
                  <span className="font-medium text-red-900" data-testid={`alert-time-${alert.id}`}>
                    {new Date(alert.detectedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {permissions?.canResolveFraudAlerts && (
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
                    className="flex-1 text-xs border-red-600 text-red-700"
                    data-testid={`button-resolve-alert-${alert.id}`}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Yopish
                  </Button>
                </div>
              )}
              {permissions?.canViewFraudAlertsAsWarning && (
                <Badge variant="outline" className="w-full justify-center border-yellow-600 text-yellow-700 text-xs">
                  Faqat ko'rish rejimi
                </Badge>
              )}
            </Card>
          );
        })}
      </div>

    </div>
  );
}
