import { Phone, PhoneOff, User, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { callScript } from '@/data/mockData';

interface IncomingCallPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallPopup({ isVisible, onClose, onAccept, onReject }: IncomingCallPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[900px] animate-in slide-in-from-top duration-300">
      <Card className="bg-white border-2 border-blue-500 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Kiruvchi Qo'ng'iroq</h3>
              <p className="text-sm text-blue-100">+998 90 123 45 67</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default" 
              className="bg-green-500 hover:bg-green-600"
              data-testid="button-accept-call"
              onClick={onAccept}
            >
              <Phone className="w-4 h-4 mr-2" />
              Qabul Qilish
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              data-testid="button-reject-call"
              onClick={onReject}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Rad Etish
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              data-testid="button-close-popup"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Mijoz</p>
                  <p className="font-semibold text-gray-900">Yangi Mijoz</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">+998 90 123 45 67</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">Manzil kiritilmagan</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-700 uppercase tracking-wide font-medium mb-2">Qo'ng'iroq Skripti</p>
              <p className="text-sm text-gray-700 mb-3">{callScript.greeting.replace('{operator_nomi}', 'Nigora')}</p>
              <div className="space-y-1.5">
                {callScript.steps.slice(0, 4).map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-amber-600 font-semibold">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-name" className="text-sm font-medium text-gray-700">
                  Mijoz Ismi <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="customer-name" 
                  placeholder="Ism va Familiya"
                  data-testid="input-customer-name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customer-phone" className="text-sm font-medium text-gray-700">
                  Telefon <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="customer-phone" 
                  placeholder="+998 00 000 00 00"
                  data-testid="input-customer-phone"
                  className="mt-1"
                  defaultValue="+998 90 123 45 67"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                  Tuman <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="district" 
                  placeholder="Tuman nomini kiriting"
                  data-testid="input-district"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Manzil <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="address" 
                  placeholder="Ko'cha va uy raqami"
                  data-testid="input-address"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="device-type" className="text-sm font-medium text-gray-700">
                  Qurilma Turi <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="device-type" 
                  placeholder="Masalan: Kir yuvish mashinasi"
                  data-testid="input-device-type"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="device-model" className="text-sm font-medium text-gray-700">
                  Model
                </Label>
                <Input 
                  id="device-model" 
                  placeholder="Masalan: Samsung WW80"
                  data-testid="input-device-model"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="issue" className="text-sm font-medium text-gray-700">
                Muammo Tavsifi <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                id="issue" 
                placeholder="Qanday muammo bor?"
                data-testid="input-issue"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1"
                data-testid="button-create-ticket"
              >
                Buyurtma Yaratish
              </Button>
              <Button 
                variant="outline"
                data-testid="button-cancel"
                onClick={onClose}
              >
                Bekor Qilish
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
