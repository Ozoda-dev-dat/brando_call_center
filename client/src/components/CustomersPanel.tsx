import { useState } from 'react';
import { Search, User, Phone, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface Customer {
  name: string | null;
  phone: string | null;
}

export function CustomersPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: customers = [], isLoading, error } = useQuery<Customer[]>({
    queryKey: ['/api/customers', debouncedSearch],
    queryFn: async () => {
      const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '';
      const response = await fetch(`/api/customers${params}`, { credentials: 'include' });
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

  const filteredCustomers = customers.filter(c => c.name || c.phone);

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

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-destructive">Xatolik: {(error as Error).message}</p>
        </Card>
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
              <h1 className="text-2xl font-bold text-white">Mijozlar</h1>
            </div>
            <p className="text-sm text-white/80 ml-[60px]">Buyurtmalardan mijozlar ro'yxati</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            {filteredCustomers.length} ta mijoz
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6 slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..."
              className="pl-10 h-11 search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              data-testid="input-search-customers"
            />
          </div>
        </Card>

        {filteredCustomers.length === 0 ? (
          <Card className="p-12 text-center fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mijozlar topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv bo'yicha natija topilmadi</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer, index) => (
              <Card 
                key={`${customer.name}-${customer.phone}-${index}`} 
                className="p-5 list-item cursor-pointer slide-up"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-semibold text-lg">
                      {customer.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {customer.name || 'Noma\'lum'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {customer.phone || 'Telefon yo\'q'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
