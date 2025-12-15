import { useState } from 'react';
import { Search, User, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
      const response = await fetch(`/api/customers${params}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return response.json();
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Xatolik: {(error as Error).message}</p>
      </div>
    );
  }

  const filteredCustomers = customers.filter(c => c.name || c.phone);

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Mijozlar</h1>
        <p className="text-sm text-gray-500 mt-1">Buyurtmalardan mijozlar ro'yxati</p>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
                data-testid="input-search-customers"
              />
            </div>
          </div>
        </Card>

        {filteredCustomers.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Mijozlar topilmadi</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map((customer, index) => (
              <Card key={`${customer.name}-${customer.phone}-${index}`} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.name || 'Noma\'lum'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
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
