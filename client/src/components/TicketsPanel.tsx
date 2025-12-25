import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle2, AlertTriangle, Loader2, Plus, X, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import { useToast } from '@/hooks/use-toast';
import type { TicketStatus } from '@shared/crm-schema';

interface Ticket {
  id: number;
  number?: string;
  customerId?: string | null;
  clientName: string | null;
  clientPhone: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  product?: string | null;
  quantity?: number | null;
  issueDescription?: string | null;
  status: string;
  masterId?: number | null;
  masterName?: string | null;
  createdAt: string;
  scheduledTime?: string | null;
  completedAt?: string | null;
  warrantyStatus?: 'in_warranty' | 'out_of_warranty' | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  distance?: number | null;
  distanceKm?: number | null;
  warrantyExpired?: boolean | null;
}

interface Master {
  id: number;
  name: string | null;
  phone: string | null;
  region: string | null;
}

const statusLabels: Record<string, string> = {
  new: 'Yangi',
  created: 'Yaratildi',
  confirmed: 'Tasdiqlandi',
  master_assigned: 'Usta tayinlandi',
  on_way: "Yo'lda",
  on_the_way: "Yo'lda",
  arrived: 'Yetib keldi',
  in_progress: 'Ishda',
  photos_taken: 'Suratlar olindi',
  payment_pending: "To'lov kutilmoqda",
  payment_blocked: 'To\'lov bloklanadi',
  completed: 'Tugatildi',
  delivered: 'Yetkazildi',
  control_call: "Nazorat qo'ng'irog'i",
  closed: 'Yopildi'
};

const statusColors: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  created: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  master_assigned: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  on_way: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  on_the_way: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  arrived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  in_progress: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  photos_taken: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  payment_pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  payment_blocked: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  control_call: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
};

const statusOptions = [
  { value: 'new', label: 'Yangi' },
  { value: 'confirmed', label: 'Tasdiqlandi' },
  { value: 'master_assigned', label: 'Usta tayinlandi' },
  { value: 'on_way', label: "Yo'lda" },
  { value: 'in_progress', label: 'Ishda' },
  { value: 'completed', label: 'Tugatildi' },
  { value: 'delivered', label: 'Yetkazildi' },
  { value: 'closed', label: 'Yopildi' },
];

export function TicketsPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const permissions = user ? getPermissions(user.role) : null;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    address: '',
    product: '',
    quantity: 1,
    masterId: '',
    status: 'new',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchMasters();
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

  const fetchMasters = async () => {
    try {
      const response = await fetch('/api/masters', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setMasters(data);
      }
    } catch (err) {
      console.error('Error fetching masters:', err);
    }
  };

  const handleCreate = async () => {
    if (!formData.clientName || !formData.clientPhone) {
      toast({ title: 'Xatolik', description: 'Mijoz ismi va telefon raqami majburiy', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          address: formData.address,
          product: formData.product,
          quantity: formData.quantity,
          masterId: formData.masterId ? parseInt(formData.masterId) : null,
          status: 'new',
        }),
      });

      if (!response.ok) throw new Error('Failed to create ticket');
      
      toast({ title: 'Muvaffaqiyat', description: 'Buyurtma yaratildi' });
      setIsCreateOpen(false);
      setFormData({ clientName: '', clientPhone: '', address: '', product: '', quantity: 1, masterId: '', status: 'new' });
      fetchTickets();
    } catch (err) {
      toast({ title: 'Xatolik', description: 'Buyurtma yaratishda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          address: formData.address,
          product: formData.product,
          quantity: formData.quantity,
          masterId: formData.masterId ? parseInt(formData.masterId) : null,
          status: formData.status,
        }),
      });

      if (!response.ok) throw new Error('Failed to update ticket');
      
      toast({ title: 'Muvaffaqiyat', description: 'Buyurtma yangilandi' });
      setIsEditOpen(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      toast({ title: 'Xatolik', description: 'Buyurtma yangilashda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Buyurtmani o'chirishni tasdiqlaysizmi?")) return;

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete');
      }
      
      toast({ title: 'Muvaffaqiyat', description: "Buyurtma o'chirildi" });
      fetchTickets();
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : "O'chirishda xatolik", variant: 'destructive' });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      toast({ title: 'Muvaffaqiyat', description: 'Holat yangilandi' });
      fetchTickets();
    } catch (err) {
      toast({ title: 'Xatolik', description: 'Holatni yangilashda xatolik', variant: 'destructive' });
    }
  };

  const openViewDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewOpen(true);
  };

  const openEditDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      clientName: ticket.clientName || '',
      clientPhone: ticket.clientPhone || '',
      address: ticket.address || '',
      product: ticket.product || '',
      quantity: ticket.quantity || 1,
      masterId: ticket.masterId?.toString() || '',
      status: ticket.status || 'new',
    });
    setIsEditOpen(true);
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (ticket.clientName?.toLowerCase().includes(searchLower)) ||
      (ticket.clientPhone?.includes(searchTerm)) ||
      (ticket.id.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
      <div className="page-header bg-gradient-to-r from-slate-800 via-slate-700 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Buyurtmalar</h1>
            <p className="text-sm text-white/80 mt-1">Barcha xizmat buyurtmalarini boshqarish</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            {filteredTickets.length} ta buyurtma
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6 slide-up shadow-lg border-0">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Qidirish..."
                className="pl-10 h-11 search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-11">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holatlar</SelectItem>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {permissions?.canCreateTicket && (
              <Button 
                className="gap-2 h-11 action-button gradient-bg border-0 shadow-lg"
                onClick={() => {
                  setFormData({ clientName: '', clientPhone: '', address: '', product: '', quantity: 1, masterId: '', status: 'new' });
                  setIsCreateOpen(true);
                }}
              >
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
          <Card className="p-12 text-center fade-in shadow-lg border-0">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Buyurtmalar topilmadi</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 'Filtr bo\'yicha natija topilmadi' : 'Hali buyurtmalar mavjud emas'}
            </p>
          </Card>
        )}

        <div className="grid gap-4">
          {filteredTickets.map((ticket, index) => {
            const isFraudTrigger = ticket.status === 'payment_blocked' || (ticket.estimatedCost && ticket.estimatedCost > 500000);
            const masterInfo = masters.find(m => m.id === ticket.masterId);
            
            return (
              <Card 
                key={ticket.id} 
                className={`p-6 list-item slide-up shadow-md border-0 ${isFraudTrigger ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'hover:shadow-xl'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {isFraudTrigger && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      <h3 className="text-lg font-bold">#{ticket.id}</h3>
                      <Badge className={statusColors[ticket.status] || 'bg-slate-100 text-slate-700'}>
                        {statusLabels[ticket.status] || ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.clientName} • {ticket.clientPhone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewDialog(ticket)} className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(ticket)} className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user?.role === 'admin' && (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(ticket.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Qurilma</p>
                    <p className="text-sm font-medium">{ticket.product || '-'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Kafolat</p>
                    <p className="text-sm font-medium">{ticket.warrantyExpired ? '❌' : '✅'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">To'lov (Masofa)</p>
                    <p className="text-sm font-medium">
                      {ticket.distanceKm ? `${(ticket.distanceKm * 3000).toLocaleString()} so'm` : "0 so'm"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Manzil</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium truncate">{ticket.address || '-'}</p>
                      {ticket.lat && ticket.lng && (
                        <a 
                          href={`https://www.google.com/maps?q=${ticket.lat},${ticket.lng}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <MapPin className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Usta:</span>
                    <span className="font-medium">{ticket.masterName || 'Tayinlanmagan'}</span>
                  </div>
                  {ticket.clientPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{ticket.clientPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value)}>
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!ticket.masterId && (
                    <Select onValueChange={(value) => {
                      fetch(`/api/tickets/${ticket.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ masterId: parseInt(value) }),
                      }).then(() => {
                        toast({ title: 'Muvaffaqiyat', description: 'Usta tayinlandi' });
                        fetchTickets();
                      });
                    }}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Usta tayinlash" />
                      </SelectTrigger>
                      <SelectContent>
                        {masters.map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Yangi Buyurtma</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mijoz ismi *</Label>
              <Input 
                value={formData.clientName} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                placeholder="Mijoz ismini kiriting"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon raqam *</Label>
              <Input 
                value={formData.clientPhone} 
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="space-y-2">
              <Label>Manzil</Label>
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Manzilni kiriting"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mahsulot</Label>
                <Input 
                  value={formData.product} 
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  placeholder="Mahsulot nomi"
                />
              </div>
              <div className="space-y-2">
                <Label>Soni</Label>
                <Input 
                  type="number"
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Usta tayinlash</Label>
              <Select value={formData.masterId} onValueChange={(v) => setFormData({...formData, masterId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Usta tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {masters.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name} - {m.region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleCreate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Buyurtmani tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mijoz ismi</Label>
              <Input 
                value={formData.clientName} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon raqam</Label>
              <Input 
                value={formData.clientPhone} 
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Manzil</Label>
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mahsulot</Label>
                <Input 
                  value={formData.product} 
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Soni</Label>
                <Input 
                  type="number"
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Holat</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Usta</Label>
              <Select value={formData.masterId} onValueChange={(v) => setFormData({...formData, masterId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Usta tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {masters.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleUpdate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Buyurtma #{selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Mijoz</p>
                  <p className="font-semibold">{selectedTicket.clientName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.clientPhone}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Holat</p>
                  <Badge className={statusColors[selectedTicket.status]}>
                    {statusLabels[selectedTicket.status] || selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase mb-1">Manzil</p>
                <p className="font-medium">{selectedTicket.address || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Mahsulot</p>
                  <p className="font-medium">{selectedTicket.product || '-'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Soni</p>
                  <p className="font-medium">{selectedTicket.quantity || 1}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase mb-1">Yaratilgan sana</p>
                <p className="font-medium">
                  {new Date(selectedTicket.createdAt).toLocaleString('uz-UZ')}
                </p>
              </div>
              {selectedTicket.masterId && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Tayinlangan usta</p>
                  <p className="font-medium">{masters.find(m => m.id === selectedTicket.masterId)?.name || 'Noma\'lum'}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Yopish</Button>
            <Button onClick={() => { setIsViewOpen(false); if(selectedTicket) openEditDialog(selectedTicket); }} className="gradient-bg border-0">
              Tahrirlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
