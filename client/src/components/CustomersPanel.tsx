import { Search, User, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import type { Client } from '@shared/schema';

export function CustomersPanel() {
  const { data: clients = [], isLoading, error } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

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

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Mijozlar</h1>
        <p className="text-sm text-gray-500 mt-1">Mijozlar bazasi va xizmat tarixi</p>
      </div>

      <div className="p-6">
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Mijoz ismi, telefon yoki manzil bo'yicha qidirish..."
                className="pl-10"
                data-testid="input-search-customers"
              />
            </div>
            <Button className="gap-2" data-testid="button-create-customer">
              <User className="w-4 h-4" />
              Yangi Mijoz
            </Button>
          </div>
        </Card>

        {clients.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Mijozlar topilmadi</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="p-6 hover-elevate cursor-pointer" data-testid={`customer-card-${client.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{client.name || 'Noma\'lum'}</h3>
                      <p className="text-sm text-gray-500">ID: {client.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900" data-testid={`customer-phone-${client.id}`}>
                        {client.phone || 'Telefon yo\'q'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">{client.address || 'Manzil yo\'q'}</span>
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
