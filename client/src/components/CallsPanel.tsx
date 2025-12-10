import { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User, Hash, PhoneCall, Delete } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface CallRecord {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
  status: 'incoming' | 'outgoing' | 'accepted' | 'rejected' | 'ended' | 'missed' | 'ringing';
  duration?: number;
  operatorId?: string;
  direction?: 'incoming' | 'outgoing';
  provider?: 'zadarma' | 'onlinepbx' | 'twilio';
  recordingUrl?: string;
}

interface OnlinePBXStatus {
  configured: boolean;
  domain: string;
}

declare global {
  interface Window {
    zadarmaWidgetFn?: (
      key: string,
      sip: string,
      shape: 'square' | 'rounded',
      lang: string,
      show: boolean,
      position: { right: string; bottom: string }
    ) => void;
    zadarmaWidget?: {
      call?: (number: string) => void;
    };
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStatusIcon(status: string, direction?: string) {
  if (direction === 'outgoing' || status === 'outgoing') {
    return <PhoneOutgoing className="w-4 h-4 text-green-500" />;
  }
  switch (status) {
    case 'incoming':
      return <PhoneIncoming className="w-4 h-4 text-blue-500" />;
    case 'accepted':
    case 'ended':
      return <PhoneCall className="w-4 h-4 text-green-500" />;
    case 'rejected':
    case 'missed':
      return <PhoneMissed className="w-4 h-4 text-red-500" />;
    default:
      return <Phone className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusBadge(status: string, direction?: string) {
  if (direction === 'outgoing' || status === 'outgoing') {
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Chiquvchi</Badge>;
  }
  switch (status) {
    case 'incoming':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Kiruvchi</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qabul qilindi</Badge>;
    case 'ended':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Tugatildi</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rad etildi</Badge>;
    case 'missed':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">O'tkazib yuborildi</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function CallsPanel() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [incomingCalls, setIncomingCalls] = useState<CallRecord[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'zadarma' | 'onlinepbx'>('all');
  const [callProvider, setCallProvider] = useState<'zadarma' | 'onlinepbx'>('zadarma');
  const { toast } = useToast();

  const { data: onlinepbxStatus } = useQuery<OnlinePBXStatus>({
    queryKey: ['/api/onlinepbx/status'],
    queryFn: async () => {
      const response = await fetch('/api/onlinepbx/status', {
        credentials: 'include',
      });
      if (!response.ok) {
        return { configured: false, domain: '' };
      }
      return response.json();
    },
  });

  const { data: zadarmaCallHistory = [], refetch: refetchZadarmaCalls } = useQuery<CallRecord[]>({
    queryKey: ['/api/calls'],
    queryFn: async () => {
      const response = await fetch('/api/calls', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      const data = await response.json();
      return data.map((call: CallRecord) => ({ ...call, provider: 'zadarma' as const }));
    },
    refetchInterval: 5000,
  });

  const { data: onlinepbxActiveCalls = [], refetch: refetchOnlinePBXActive } = useQuery<CallRecord[]>({
    queryKey: ['/api/onlinepbx/calls'],
    queryFn: async () => {
      const response = await fetch('/api/onlinepbx/calls', {
        credentials: 'include',
      });
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    refetchInterval: 5000,
    enabled: onlinepbxStatus?.configured ?? false,
  });

  const { data: onlinepbxHistory = [], refetch: refetchOnlinePBXHistory } = useQuery<CallRecord[]>({
    queryKey: ['/api/onlinepbx/history'],
    queryFn: async () => {
      const response = await fetch('/api/onlinepbx/history', {
        credentials: 'include',
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.map((item: any) => ({
        callId: item.call_id || `opbx_${Date.now()}_${Math.random()}`,
        from: item.caller || item.from || 'Unknown',
        to: item.called || item.to || '',
        timestamp: new Date(item.start || item.timestamp),
        duration: item.duration || 0,
        direction: item.direction === 'out' ? 'outgoing' : 'incoming',
        status: item.status === 'answered' ? 'ended' : item.status === 'missed' ? 'missed' : 'ended',
        provider: 'onlinepbx' as const,
        recordingUrl: item.record,
      }));
    },
    refetchInterval: 30000,
    enabled: onlinepbxStatus?.configured ?? false,
  });

  const onlinepbxCallHistory = [...onlinepbxActiveCalls, ...onlinepbxHistory];

  const callHistory = [...zadarmaCallHistory, ...onlinepbxCallHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredCallHistory = selectedProvider === 'all' 
    ? callHistory 
    : callHistory.filter(c => c.provider === selectedProvider);

  const refetchCalls = () => {
    refetchZadarmaCalls();
    if (onlinepbxStatus?.configured) {
      refetchOnlinePBXActive();
      refetchOnlinePBXHistory();
    }
  };

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'incoming_call') {
          const callData = { ...message.data as CallRecord, provider: 'zadarma' as const };
          setIncomingCalls(prev => [callData, ...prev.filter(c => c.callId !== callData.callId)]);
          toast({
            title: "Kiruvchi qo'ng'iroq (Zadarma)",
            description: `${callData.from} raqamidan`,
          });
          refetchCalls();
        } else if (message.type === 'onlinepbx_incoming_call') {
          const callData = message.data as CallRecord;
          setIncomingCalls(prev => [callData, ...prev.filter(c => c.callId !== callData.callId)]);
          toast({
            title: "Kiruvchi qo'ng'iroq (OnlinePBX)",
            description: `${callData.from} raqamidan`,
          });
          refetchCalls();
        } else if (message.type === 'call_accepted' || message.type === 'call_rejected' || message.type === 'call_ended') {
          setIncomingCalls(prev => prev.filter(c => c.callId !== message.data?.callSid && c.callId !== message.data?.callId));
          refetchCalls();
        } else if (message.type === 'onlinepbx_call_accepted' || message.type === 'onlinepbx_call_rejected' || message.type === 'onlinepbx_call_ended' || message.type === 'onlinepbx_call_status') {
          setIncomingCalls(prev => prev.filter(c => c.callId !== message.data?.callId));
          refetchCalls();
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [toast, refetchCalls]);

  const handleDialerInput = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!phoneNumber) {
      toast({
        title: "Xato",
        description: "Telefon raqamini kiriting",
        variant: "destructive"
      });
      return;
    }

    try {
      let response;
      
      if (callProvider === 'onlinepbx' && onlinepbxStatus?.configured) {
        response = await fetch('/api/onlinepbx/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: 'default', to: phoneNumber }),
          credentials: 'include',
        });
      } else {
        response = await fetch('/api/calls/outgoing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, useCallback: true }),
          credentials: 'include',
        });
      }

      if (response.ok) {
        toast({
          title: "Qo'ng'iroq",
          description: `${phoneNumber} raqamiga qo'ng'iroq qilinmoqda...`,
        });
        setPhoneNumber('');
        refetchCalls();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Xato",
          description: errorData.message || "Qo'ng'iroqni boshlashda xato",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Xato",
        description: "Telefon tizimi hozircha mavjud emas",
        variant: "destructive"
      });
    }
  };

  const handleAcceptCall = async (callId: string, provider?: string) => {
    try {
      const endpoint = provider === 'onlinepbx' 
        ? `/api/onlinepbx/calls/${callId}/accept`
        : `/api/calls/${callId}/accept`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId: 'current-user' }),
        credentials: 'include',
      });
      if (response.ok) {
        toast({ title: "Qo'ng'iroq qabul qilindi" });
        setIncomingCalls(prev => prev.filter(c => c.callId !== callId));
        refetchCalls();
      }
    } catch (error) {
      toast({ title: "Xato", description: "Qo'ng'iroqni qabul qilishda xato", variant: "destructive" });
    }
  };

  const handleRejectCall = async (callId: string, provider?: string) => {
    try {
      const endpoint = provider === 'onlinepbx' 
        ? `/api/onlinepbx/calls/${callId}/reject`
        : `/api/calls/${callId}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        toast({ title: "Qo'ng'iroq rad etildi" });
        setIncomingCalls(prev => prev.filter(c => c.callId !== callId));
        refetchCalls();
      }
    } catch (error) {
      toast({ title: "Xato", description: "Qo'ng'iroqni rad etishda xato", variant: "destructive" });
    }
  };

  const dialerButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Qo'ng'iroqlar</h1>
        <p className="text-sm text-gray-500">Kiruvchi va chiquvchi qo'ng'iroqlarni boshqaring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneOutgoing className="w-5 h-5" />
              Qo'ng'iroq qilish
            </CardTitle>
            <CardDescription>Telefon raqamini kiriting yoki terish tugmalaridan foydalaning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {onlinepbxStatus?.configured && (
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={callProvider === 'zadarma' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setCallProvider('zadarma')}
                  >
                    Zadarma
                  </Button>
                  <Button
                    variant={callProvider === 'onlinepbx' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setCallProvider('onlinepbx')}
                  >
                    OnlinePBX
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg text-center font-mono"
                />
                <Button variant="ghost" size="icon" onClick={handleBackspace}>
                  <Delete className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {dialerButtons.map((row, rowIndex) => (
                  row.map((digit) => (
                    <Button
                      key={`${rowIndex}-${digit}`}
                      variant="outline"
                      className="h-14 text-xl font-semibold"
                      onClick={() => handleDialerInput(digit)}
                    >
                      {digit}
                    </Button>
                  ))
                ))}
              </div>

              <Button
                className="w-full h-14 text-lg gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleCall}
              >
                <Phone className="w-5 h-5" />
                Qo'ng'iroq qilish
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Qo'ng'iroqlar tarixi</span>
              {onlinepbxStatus?.configured && (
                <div className="flex gap-2">
                  <Button
                    variant={selectedProvider === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProvider('all')}
                  >
                    Barchasi
                  </Button>
                  <Button
                    variant={selectedProvider === 'zadarma' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProvider('zadarma')}
                  >
                    Zadarma
                  </Button>
                  <Button
                    variant={selectedProvider === 'onlinepbx' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProvider('onlinepbx')}
                  >
                    OnlinePBX
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              So'nggi qo'ng'iroqlar ro'yxati
              {onlinepbxStatus?.configured && (
                <span className="ml-2 text-green-600">• OnlinePBX ulangan ({onlinepbxStatus.domain})</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Barchasi</TabsTrigger>
                <TabsTrigger value="incoming">Kiruvchi</TabsTrigger>
                <TabsTrigger value="outgoing">Chiquvchi</TabsTrigger>
                <TabsTrigger value="missed">O'tkazib yuborilgan</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <CallList calls={filteredCallHistory} />
              </TabsContent>
              <TabsContent value="incoming">
                <CallList calls={filteredCallHistory.filter(c => c.direction === 'incoming' || (!c.direction && c.status !== 'outgoing'))} />
              </TabsContent>
              <TabsContent value="outgoing">
                <CallList calls={filteredCallHistory.filter(c => c.direction === 'outgoing' || c.status === 'outgoing')} />
              </TabsContent>
              <TabsContent value="missed">
                <CallList calls={filteredCallHistory.filter(c => c.status === 'missed' || c.status === 'rejected')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {incomingCalls.length > 0 && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PhoneIncoming className="w-5 h-5 animate-pulse" />
              Faol kiruvchi qo'ng'iroqlar ({incomingCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomingCalls.map((call) => (
                <div
                  key={call.callId}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <PhoneIncoming className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{call.from}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(call.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {call.provider && (
                      <Badge variant="outline" className={
                        call.provider === 'onlinepbx' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }>
                        {call.provider === 'onlinepbx' ? 'OnlinePBX' : 'Zadarma'}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      onClick={() => handleRejectCall(call.callId, call.provider)}
                    >
                      Rad etish
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAcceptCall(call.callId, call.provider)}
                    >
                      Qabul qilish
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CallList({ calls }: { calls: CallRecord[] }) {
  if (calls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Qo'ng'iroqlar mavjud emas</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {calls.map((call) => (
          <div
            key={call.callId}
            className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {getStatusIcon(call.status, call.direction)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {call.direction === 'outgoing' || call.status === 'outgoing' ? call.to : call.from}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(call.timestamp)}</span>
                  <span>•</span>
                  <span>{formatTime(call.timestamp)}</span>
                  {call.duration !== undefined && call.duration > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(call.duration)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {call.provider && (
                <Badge variant="outline" className={
                  call.provider === 'onlinepbx' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }>
                  {call.provider === 'onlinepbx' ? 'OnlinePBX' : 'Zadarma'}
                </Badge>
              )}
              {getStatusBadge(call.status, call.direction)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
