import { MapPin, Camera, FileSignature, CreditCard, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function MasterAppPreview() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Usta Mobil Ilovasi</h2>
      
      <div className="mx-auto max-w-[280px]">
        <div className="relative rounded-3xl border-8 border-gray-800 shadow-2xl bg-white aspect-[9/19] overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
          
          <div className="h-full overflow-y-auto p-4 pt-8">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-4">
                <p className="text-xs opacity-80 mb-1">Faol Buyurtma</p>
                <p className="font-semibold text-lg">TK-2024-1832</p>
                <p className="text-sm mt-2">Akmal Rahimov</p>
                <p className="text-xs opacity-90">Yunusobod tumani</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">GPS Kuzatuv</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-md h-32 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <p className="text-xs text-gray-600">Manzilga 8.5 km</p>
                    <p className="text-xs text-gray-500">Taxminiy: 18 daqiqa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Suratlar</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-md h-20 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-500">Oldin</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-md h-20 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-500">Keyin</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-red-700 font-medium">
                    Majburiy: Ish boshlashdan oldin va keyin surat
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileSignature className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Mijoz Imzosi</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-md h-16 flex items-center justify-center">
                  <p className="text-[10px] text-gray-500">Imzo uchun bosing</p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-red-600" />
                  <p className="text-xs font-medium text-red-700 uppercase tracking-wide">To'lov Bloklanadi</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-red-700">
                      <span className="font-semibold">OGOHLANTIRISH:</span> Bu qurilma kafolatda. 
                      To'lov olish mumkin emas!
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px] w-full justify-center">
                    Kafolat: Faol
                  </Badge>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="sm"
                data-testid="button-complete-work"
              >
                Ishni Tugatish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        Ustalar uchun real-time kuzatuv
      </p>
    </Card>
  );
}
