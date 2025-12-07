import { Search, User, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/data/mockData';

export function CustomersPanel() {
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

        <div className="grid gap-4">
          {mockCustomers.map((customer) => (
            <Card key={customer.id} className="p-6 hover-elevate cursor-pointer" data-testid={`customer-card-${customer.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">ID: {customer.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-700">
                    {customer.totalTickets} buyurtma
                  </Badge>
                  {customer.activeTickets > 0 && (
                    <Badge variant="default">
                      {customer.activeTickets} faol
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900" data-testid={`customer-phone-${customer.id}`}>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{customer.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900">{customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tuman</p>
                    <p className="text-sm font-medium text-gray-900">{customer.district}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Oxirgi Xizmat</p>
                    <p className="text-sm font-medium text-gray-900">
                      {customer.lastServiceDate 
                        ? new Date(customer.lastServiceDate).toLocaleDateString('uz-UZ') 
                        : 'Yo\'q'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mijoz bo'lgan vaqti</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(customer.customerSince).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Izoh
                  </p>
                  <p className="text-sm text-gray-700">{customer.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
