import { 
  Circle, 
  CheckCircle2, 
  Phone, 
  UserCheck, 
  Navigation, 
  MapPin, 
  Camera, 
  CreditCard, 
  XCircle, 
  CheckCheck, 
  PhoneCall,
  FileCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TicketStatus } from '@shared/crm-schema';

interface TicketProgressProps {
  currentStatus: TicketStatus;
  ticketNumber: string;
  customerName: string;
  masterName?: string;
  readOnly?: boolean;
}

interface Step {
  id: number;
  status: TicketStatus;
  label: string;
  icon: any;
  description: string;
}

const steps: Step[] = [
  { id: 1, status: 'created', label: 'Yaratildi', icon: Circle, description: 'Buyurtma qabul qilindi' },
  { id: 2, status: 'confirmed', label: 'Tasdiqlandi', icon: Phone, description: 'Mijoz bilan tasdiklandi' },
  { id: 3, status: 'master_assigned', label: 'Usta tayinlandi', icon: UserCheck, description: 'Ustaga biriktirildi' },
  { id: 4, status: 'on_the_way', label: 'Yo\'lda', icon: Navigation, description: 'GPS kuzatuv faol' },
  { id: 5, status: 'arrived', label: 'Yetib keldi', icon: MapPin, description: 'Manzilda' },
  { id: 6, status: 'in_progress', label: 'Ishda', icon: FileCheck, description: 'Ish jarayonida' },
  { id: 7, status: 'photos_taken', label: 'Suratlar', icon: Camera, description: 'Oldin/Keyin suratlari' },
  { id: 8, status: 'payment_pending', label: 'To\'lov kutilmoqda', icon: CreditCard, description: 'To\'lov tasdiqi' },
  { id: 9, status: 'completed', label: 'Tugatildi', icon: CheckCircle2, description: 'Ish tugadi' },
  { id: 10, status: 'control_call', label: 'Nazorat qo\'ng\'irog\'i', icon: PhoneCall, description: 'Sifat nazorati' },
  { id: 11, status: 'closed', label: 'Yopildi', icon: CheckCheck, description: 'Buyurtma yopildi' }
];

function getStepState(stepStatus: TicketStatus, currentStatus: TicketStatus): 'completed' | 'active' | 'pending' {
  const stepIndex = steps.findIndex(s => s.status === stepStatus);
  const currentIndex = steps.findIndex(s => s.status === currentStatus);
  
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'pending';
}

export function TicketProgress({ currentStatus, ticketNumber, customerName, masterName, readOnly = false }: TicketProgressProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Buyurtma Jarayoni</h2>
          <p className="text-sm text-gray-500 mt-1">
            {ticketNumber} • {customerName}
            {masterName && ` • Usta: ${masterName}`}
          </p>
        </div>
        <Badge 
          variant="secondary" 
          className="text-sm px-3 py-1"
          data-testid="badge-current-status"
        >
          {steps.find(s => s.status === currentStatus)?.label || 'Noma\'lum'}
        </Badge>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = getStepState(step.status, currentStatus);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      state === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : state === 'active'
                        ? 'bg-blue-600 border-blue-600 animate-pulse'
                        : 'bg-white border-gray-300'
                    }`}
                    data-testid={`step-${step.status}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        state === 'completed' || state === 'active'
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-12 ${
                        state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <p
                    className={`font-medium ${
                      state === 'completed'
                        ? 'text-green-700'
                        : state === 'active'
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  
                  {state === 'active' && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      ← Joriy holat
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
