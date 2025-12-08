import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import type { TicketStatus } from '@shared/crm-schema';

// MA'LUMOTLAR BAZASIDAGI NOMLARGA MOSLANGAN INTERFEYS
interface Ticket {
  id: string;
  number: string;
  customerId?: string | null;
  clientName: string; // DB: client_name
  clientPhone: string; // DB: client_phone
  address?: string | null; // DB: address
  lat?: number | null;
  lng?: number | null;
  product?: string | null; // DB: product
  quantity?: number | null; // DB: quantity (deviceModel o'rniga)
  issueDescription?: string | null;
  status: TicketStatus;
  masterId?: string | null;
  masterName?: string | null;
  createdAt: string;
  scheduledTime?: string | null;
  completedAt?: string | null;
  warrantyStatus?: 'in_warranty' | 'out_of_warranty' | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  distance?: number | null;
}

const statusLabels: Record<TicketStatus, string> = {
  created: 'Yaratildi',
  confirmed: 'Tasdiqlandi',
  master_assigned: 'Usta tayinlandi',
  on_the_way: 'Yo\'lda',
  arrived: 'Yetib keldi',
  in_progress: 'Ishda',
  photos_taken: 'Suratlar olindi',
  payment_pending: 'To\'lov kutilmoqda',
  payment_blocked: 'To\'lov bloklanadi',
  completed: 'Tugatildi',
  control_call: 'Nazorat qo\'ng\'irog\'i',
  closed: 'Yopildi'
};

const statusColors: Record<string, string> = {
  created: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  master_assigned: 'bg-indigo-100 text-indigo-700',
  on_the_way: 'bg-purple-100 text-purple-700',
  arrived: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-orange-100 text-orange-700',
  photos_taken: 'bg-cyan-100 text-cyan-700',
  payment_pending: 'bg-amber-100 text-amber-700',
  payment_blocked: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  control_call: 'bg-teal-100 text-teal-700',
  closed: 'bg-gray-100 text-gray-700'
};

export function TicketsPanel() {
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tickets', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ticket.number.toLowerCase().includes(search) ||
      ticket.clientName.toLowerCase().includes(search) || // clientName ga o'zgartirildi
      ticket.clientPhone.includes(search) // clientPhone ga o'zgartirildi
    );
  });

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Buyurtmalar</h1>
        <p className="text-sm text-gray-500 mt-1">Barcha xizmat buyurtmalarini boshqarish</p>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buyurtma raqami, mijoz ismi yoki telefon bo'yicha qidirish..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-tickets"
              />
            </div>
            <Button variant="outline" className="gap-2" data-testid="button-filter-tickets">
              <Filter className="w-4 h-4" />
              Filtr
            </Button>
            {permissions?.canCreateTicket && (
              <Button className="gap-2" data-testid="button-create-ticket">
                <FileText className="w-4 h-4" />
                Yangi Buyurtma
              </Button>
            )}
          </div>
        </Card>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchTickets} variant="outline" className="mt-2">
              Qayta urinish
            </Button>
          </Card>
        )}

        {filteredTickets.length === 0 && !error && (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Buyurtmalar topilmadi</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hali buyurtmalar mavjud emas'}
            </p>
          </Card>
        )}

        <div className="grid gap-4">
          {filteredTickets.map((ticket) => {
            const isFraudTrigger = ticket.status === 'payment_blocked' || (ticket.estimatedCost && ticket.estimatedCost > 500000);
            return (
            <Card 
              key={ticket.id} 
              className={`p-6 hover-elevate cursor-pointer ${isFraudTrigger ? 'border-2 border-red-500 bg-red-50' : ''}`}
              data-testid={`ticket-card-${ticket.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {isFraudTrigger && <AlertTriangle className="w-5 h-5 text-red-600" data-testid={`fraud-icon-${ticket.id}`} />}
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.number}</h3>
                    <Badge className={statusColors[ticket.status] || 'bg-gray-100 text-gray-700'} data-testid={`badge-status-${ticket.id}`}>
                      {statusLabels[ticket.status] || ticket.status}
                    </Badge>
                    {ticket.warrantyStatus === 'in_warranty' && (
                      <Badge variant="outline" className="border-blue-500 text-blue-700">
                        Kafolatda
                      </Badge>
                    )}
                  </div>
                  {/* clientName va clientPhone ga o'zgartirildi */}
                  <p className="text-sm text-gray-600">{ticket.clientName} • {ticket.clientPhone}</p> 
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('uz-UZ')} {new Date(ticket.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Qurilma</p>
                  {/* product ga o'zgartirildi */}
                  <p className="text-sm font-medium text-gray-900" data-testid={`device-type-${ticket.id}`}>{ticket.product || '-'}</p> 
                  {/* quantity ga o'zgartirildi */}
                  {ticket.quantity && (
                    <p className="text-sm text-gray-600">Soni: {ticket.quantity}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Manzil</p>
                  {/* address ga o'zgartirildi */}
                  <p className="text-sm text-gray-900">{ticket.address || '-'}</p> 
                </div>
              </div>

              {ticket.issueDescription && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Muammo</p>
                  <p className="text-sm text-gray-700">{ticket.issueDescription}</p>
                </div>
              )}
                
              {/* ... (Qolgan kod o'zgarishsiz qoladi) */}
              {ticket.masterName && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Usta:</span>
                  <span className="font-medium text-gray-900">{ticket.masterName}</span>
                  {ticket.scheduledTime && (
                    <>
                      <Clock className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="text-gray-600">
                        {new Date(ticket.scheduledTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </>
                  )}
                </div>
              )}

              {ticket.estimatedCost && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxminiy narx:</span>
                    <span className={`text-lg font-semibold ${ticket.estimatedCost > 500000 ? 'text-red-700' : 'text-gray-900'}`} data-testid={`ticket-cost-${ticket.id}`}>
                      {ticket.estimatedCost.toLocaleString('uz-UZ')} so'm
                    </span>
                  </div>
                  {ticket.estimatedCost > 500000 && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Yuqori narx - nazorat talab qilinadi
                    </p>
                  )}
                </div>
              )}

              {isFraudTrigger && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="destructive" className="flex-1" data-testid={`button-review-ticket-${ticket.id}`}>
                    Ko'rib Chiqish
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-red-600 text-red-700" data-testid={`button-block-ticket-${ticket.id}`}>
                    Bloklash
                  </Button>
                </div>
              )}
            </Card>
          );
          })}
        </div>
      </div>
    </div>
  );
}
