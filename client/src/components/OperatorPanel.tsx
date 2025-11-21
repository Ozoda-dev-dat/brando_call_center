import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IncomingCallPopup } from './IncomingCallPopup';
import { TicketProgress } from './TicketProgress';
import { MasterAppPreview } from './MasterAppPreview';
import { SimpleFraudAlerts } from './SimpleFraudAlerts';
import { mockTickets } from '@/data/mockData';

export function OperatorPanel() {
  const [showCallPopup, setShowCallPopup] = useState(false);
  const activeTicket = mockTickets[0];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <IncomingCallPopup
        isVisible={showCallPopup}
        onClose={() => setShowCallPopup(false)}
        onAccept={() => {
          console.log('Call accepted');
        }}
        onReject={() => {
          setShowCallPopup(false);
        }}
      />

      <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Operator Paneli</h1>
          <p className="text-sm text-gray-500 mt-1">Qo'ng'iroqlar va buyurtmalarni boshqarish</p>
        </div>
        <Button
          onClick={() => setShowCallPopup(true)}
          className="gap-2"
          data-testid="button-simulate-call"
        >
          <Phone className="w-4 h-4" />
          Qo'ng'iroqni Simulyatsiya Qilish
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <TicketProgress
            currentStatus={activeTicket.status}
            ticketNumber={activeTicket.number}
            customerName={activeTicket.customerName}
            masterName={activeTicket.masterName}
          />
        </div>
        
        <div className="w-80 p-6 border-l border-gray-200 overflow-auto bg-white">
          <MasterAppPreview />
        </div>

        <div className="w-96 p-6 border-l-4 border-red-600 overflow-auto bg-red-50">
          <SimpleFraudAlerts />
        </div>
      </div>
    </div>
  );
}
