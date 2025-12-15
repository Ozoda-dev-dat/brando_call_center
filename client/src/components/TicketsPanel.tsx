import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle2, AlertTriangle, Loader2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import type { TicketStatus } from '@shared/crm-schema';

interface Ticket {
  id: string;
  number: string;
  customerId?: string | null;
  clientName: string;
  clientPhone: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  product?: string | null;
  quantity?: number | null;
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
  created: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  master_assigned: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  on_the_way: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  arrived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  in_progress: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  photos_taken: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  payment_pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  payment_blocked: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  control_call: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
      const response = await fetch('/api/tickets', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch tickets');
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
      ticket.number?.toLowerCase().includes(search) ||
      ticket.clientName?.toLowerCase().includes(search) ||
      ticket.clientPhone?.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted/30 overflow-auto">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title text-2xl font-bold">Buyurtmalar</h1>
            <p className="text-sm text-muted-foreground mt-1">Barcha xizmat buyurtmalarini boshqarish</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredTickets.length} ta buyurtma
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6 slide-up">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buyurtma raqami, mijoz ismi yoki telefon bo'yicha qidirish..."
                className="pl-10 h-11 search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-tickets"
              />
            </div>
            <Button variant="outline" className="gap-2 h-11 action-button" data-testid="button-filter-tickets">
              <Filter className="w-4 h-4" />
              Filtr
            </Button>
            {permissions?.canCreateTicket && (
              <Button className="gap-2 h-11 action-button gradient-bg border-0" data-testid="button-create-ticket">
                <Plus className="w-4 h-4" />
                Yangi Buyurtma
              </Button>
            )}
          </div>
        </Card>

        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20 fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-destructive flex-1">{error}</p>
              <Button onClick={fetchTickets} variant="outline" size="sm">
                Qayta urinish
              </Button>
            </div>
          </Card>
        )}

        {filteredTickets.length === 0 && !error && (
          <Card className="p-12 text-center fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Buyurtmalar topilmadi</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hali buyurtmalar mavjud emas'}
            </p>
          </Card>
        )}

        <div className="grid gap-4">
          {filteredTickets.map((ticket, index) => {
            const isFraudTrigger = ticket.status === 'payment_blocked' || (ticket.estimatedCost && ticket.estimatedCost > 500000);
            return (
              <Card 
                key={ticket.id} 
                className={`p-6 list-item cursor-pointer slide-up ${isFraudTrigger ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`ticket-card-${ticket.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {isFraudTrigger && <AlertTriangle className="w-5 h-5 text-red-600" data-testid={`fraud-icon-${ticket.id}`} />}
                      <h3 className="text-lg font-semibold">{ticket.number}</h3>
                      <Badge className={statusColors[ticket.status] || 'bg-slate-100 text-slate-700'} data-testid={`badge-status-${ticket.id}`}>
                        {statusLabels[ticket.status] || ticket.status}
                      </Badge>
                      {ticket.warrantyStatus === 'in_warranty' && (
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          Kafolatda
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.clientName} • {ticket.clientPhone}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString('uz-UZ')} {new Date(ticket.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Qurilma</p>
                    <p className="text-sm font-medium" data-testid={`device-type-${ticket.id}`}>{ticket.product || '-'}</p>
                    {ticket.quantity && <p className="text-sm text-muted-foreground">Soni: {ticket.quantity}</p>}
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Manzil</p>
                    <p className="text-sm">{ticket.address || '-'}</p>
                  </div>
                </div>

                {ticket.masterName && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Usta:</span>
                    <span className="font-medium">{ticket.masterName}</span>
                    {ticket.scheduledTime && (
                      <>
                        <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                        <span className="text-muted-foreground">
                          {new Date(ticket.scheduledTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {ticket.estimatedCost && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxminiy narx:</span>
                      <span className={`text-lg font-semibold ${ticket.estimatedCost > 500000 ? 'text-red-600' : ''}`} data-testid={`ticket-cost-${ticket.id}`}>
                        {ticket.estimatedCost.toLocaleString('uz-UZ')} so'm
                      </span>
                    </div>
                  </div>
                )}

                {isFraudTrigger && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="destructive" className="flex-1 action-button" data-testid={`button-review-ticket-${ticket.id}`}>
                      Ko'rib Chiqish
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50" data-testid={`button-block-ticket-${ticket.id}`}>
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
