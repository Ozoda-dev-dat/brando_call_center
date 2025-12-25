import { useState, useMemo } from 'react';
import { Search, User, Phone, Loader2, MapPin, History, TrendingUp, PhoneCall, PlusCircle, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface Customer {
  name: string | null;
  phone: string | null;
  address: string | null;
  orderCount: number;
  ltv: number;
  history: any[];
  lastOrderDate: string | null;
}

export function CustomersPanel() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'loyalty'>('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customers = [], isLoading, error } = useQuery<Customer[]>({
    queryKey: ['/api/customers', debouncedSearch, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearch,
        sortBy: sortBy
      });
      const response = await fetch(`/api/customers?${params.toString()}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const timeoutId = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeoutId);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
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
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Mijozlar Bazasi</h1>
            </div>
            <p className="text-sm text-white/80 ml-[60px]">Barcha buyurtma bergan mijozlar tahlili</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            {customers.length} ta mijoz
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6 slide-up">
          <Card className="p-2 flex-1 shadow-lg border-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ism, telefon yoki manzil bo'yicha qidirish..."
                className="pl-10 h-11 border-0 focus-visible:ring-0 shadow-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </Card>
          <Button 
            variant="outline" 
            className="h-full px-6 bg-white shadow-md border-0 gap-2"
            onClick={() => setSortBy(sortBy === 'recent' ? 'loyalty' : 'recent')}
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortBy === 'recent' ? 'Eng yangi' : 'Sodiqlik bo\'yicha'}
          </Button>
        </div>

        {customers.length === 0 ? (
          <Card className="p-12 text-center fade-in shadow-xl border-0">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mijozlar topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv bo'yicha natija topilmadi</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer, index) => (
              <Card 
                key={`${customer.name}-${customer.phone}-${index}`} 
                className="p-5 list-item cursor-pointer slide-up hover:shadow-xl transition-all border-0 shadow-md group"
                style={{ animationDelay: `${index * 0.03}s` }}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xl group-hover:scale-105 transition-transform">
                    {getInitials(customer.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold truncate text-lg">
                        {customer.name || 'Noma\'lum'}
                      </h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">
                        {customer.orderCount} ta
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{customer.phone || 'Telefon yo\'q'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{customer.address || 'Manzil yo\'q'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-3xl">
          {selectedCustomer && (
            <div className="flex flex-col">
              <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl text-white font-bold text-4xl">
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedCustomer.name}</h2>
                    <div className="flex gap-4">
                      <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                        <p className="text-xs text-white/60 uppercase font-bold mb-1">LTV (Qiymat)</p>
                        <p className="text-xl font-bold">{selectedCustomer.ltv.toLocaleString()} so'm</p>
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                        <p className="text-xs text-white/60 uppercase font-bold mb-1">Buyurtmalar</p>
                        <p className="text-xl font-bold">{selectedCustomer.orderCount} ta</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-14 rounded-2xl gap-2 gradient-bg border-0 text-lg font-bold shadow-lg shadow-orange-500/20" asChild>
                    <a href={`tel:${selectedCustomer.phone}`}>
                      <PhoneCall className="w-5 h-5" />
                      Qo'ng'iroq qilish
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-2xl gap-2 text-lg font-bold border-2"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setLocation('/tickets');
                    }}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Buyurtma yaratish
                  </Button>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-orange-500" />
                    Buyurtmalar tarixi
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {selectedCustomer.history.map((order: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border hover:bg-muted transition-colors">
                        <div>
                          <p className="font-bold">#{order.id} - {order.product}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</p>
                        </div>
                        <Badge variant="outline" className="bg-white px-3 py-1 font-bold">
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                    {selectedCustomer.history.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 italic">Tarix mavjud emas</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
