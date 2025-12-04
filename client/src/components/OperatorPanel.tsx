import { useState } from 'react';
import { Phone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IncomingCallPopup } from './IncomingCallPopup';
import { TicketProgress } from './TicketProgress';
import { MasterAppPreview } from './MasterAppPreview';
import { SimpleFraudAlerts } from './SimpleFraudAlerts';
import { mockTickets } from '@/data/mockData';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';

interface IncomingCall {
  callSid: string;
  from: string;
  to: string;
  callerId: string;
  timestamp: Date;
  operatorId?: string;
  status: 'incoming' | 'accepted' | 'rejected' | 'ended';
  duration?: number;
}

export function OperatorPanel() {
  const [showCallPopup, setShowCallPopup] = useState(false);
  const activeTicket = mockTickets[0];
  const { user } = useAuth();
  const permissions = user ? getPermissions(user.role) : null;
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
export function OperatorPanel() {
      <IncomingCallPopup
      import { useEffect } from 'react';
        isVisible={showCallPopup}
        onClose={() => setShowCallPopup(false)}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

  useEffect(() => {
    // Connect to WebSocket for incoming calls
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    try {
      const websocket = new WebSocket(wsUrl);
      <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
      websocket.onopen = () => {
        console.log('Connected to incoming calls WebSocket');
      };
        <div>
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'incoming_call' && message.data) {
            console.log('Incoming call received:', message.data);
            setIncomingCall(message.data);
            setShowCallPopup(true);
          } else if (message.type === 'call_rejected') {
            setShowCallPopup(false);
            setIncomingCall(null);
          } else if (message.type === 'call_ended') {
            setShowCallPopup(false);
            setIncomingCall(null);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
          <div className="flex items-center gap-3">
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
            <h1 className="text-2xl font-semibold text-gray-900">Operator Paneli</h1>
      websocket.onclose = () => {
        console.log('Disconnected from incoming calls WebSocket');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          setWs(null);
        }, 3000);
      };
            {user?.role === 'admin' && (
      setWs(websocket);
              <Badge variant="outline" className="border-blue-500 text-blue-700">
      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, []);
                <Eye className="w-3 h-3 mr-1" />
                Kuzatish Rejimi
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'admin' 
              ? 'Operatorlar faoliyatini kuzatish (Faqat ko\'rish)'
              : 'Qo\'ng\'iroqlar va buyurtmalarni boshqarish'}
          </p>
        </div>
        {permissions?.canAccessOperatorPanel && (
          <Button
            onClick={() => setShowCallPopup(true)}
            className="gap-2"
            data-testid="button-simulate-call"
          >
            <Phone className="w-4 h-4" />
            Qo'ng'iroqni Simulyatsiya Qilish
          </Button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <TicketProgress
            currentStatus={activeTicket.status}
            ticketNumber={activeTicket.number}
            customerName={activeTicket.customerName}
            masterName={activeTicket.masterName}
            readOnly={!permissions?.canAccessOperatorPanel}
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

  useEffect(() => {
    // Connect to WebSocket for incoming calls
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    try {
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('Connected to incoming calls WebSocket');
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'incoming_call' && message.data) {
            console.log('Incoming call received:', message.data);
            setIncomingCall(message.data);
            setShowCallPopup(true);
          } else if (message.type === 'call_rejected') {
            setShowCallPopup(false);
            setIncomingCall(null);
          } else if (message.type === 'call_ended') {
            setShowCallPopup(false);
            setIncomingCall(null);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = () => {
        console.log('Disconnected from incoming calls WebSocket');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          setWs(null);
        }, 3000);
      };

      setWs(websocket);

      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, []);

  const handleAcceptCall = async () => {
    if (!incomingCall || !user) return;

    try {
      const response = await fetch(`/api/calls/${incomingCall.callSid}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId: user.id }),
      });

      if (response.ok) {
        console.log('Call accepted');
        setIncomingCall(prev => prev ? { ...prev, status: 'accepted' } : null);
      }
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall) return;

    try {
      const response = await fetch(`/api/calls/${incomingCall.callSid}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Call rejected');
        setShowCallPopup(false);
        setIncomingCall(null);
      }
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };
