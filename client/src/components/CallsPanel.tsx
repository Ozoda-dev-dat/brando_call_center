import { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User, Hash, PhoneCall, Delete, Headphones, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { WebRTCPhone } from './WebRTCPhone';

interface CallRecord {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
  status: 'incoming' | 'outgoing' | 'accepted' | 'rejected' | 'ended' | 'missed' | 'ringing';
  duration?: number;
  operatorId?: string;
  direction?: 'incoming' | 'outgoing';
  provider?: 'onlinepbx';
  recordingUrl?: string;
}

interface OnlinePBXStatus {
  configured: boolean;
  domain: string;
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
    return <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">Chiquvchi</Badge>;
  }
  switch (status) {
    case 'incoming':
      return <Badge className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0">Kiruvchi</Badge>;
    case 'accepted':
      return <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">Qabul qilindi</Badge>;
    case 'ended':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Tugatildi</Badge>;
    case 'rejected':
      return <Badge className="bg-gradient-to-r from-red-400 to-rose-500 text-white border-0">Rad etildi</Badge>;
    case 'missed':
      return <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white border-0">O'tkazib yuborildi</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function CallsPanel() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [incomingCalls, setIncomingCalls] = useState<CallRecord[]>([]);
  const [sipExtension, setSipExtension] = useState('');
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
  });

  const callHistory = [...onlinepbxActiveCalls, ...onlinepbxHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const refetchCalls = () => {
    refetchOnlinePBXActive();
    refetchOnlinePBXHistory();
  };

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'onlinepbx_incoming_call') {
          const callData = message.data as CallRecord;
          setIncomingCalls(prev => [callData, ...prev.filter(c => c.callId !== callData.callId)]);
          toast({
            title: "Kiruvchi qo'ng'iroq",
            description: `${callData.from} raqamidan`,
          });
          refetchCalls();
        } else if (message.type === 'onlinepbx_call_accepted' || message.type === 'onlinepbx_call_rejected' || message.type === 'onlinepbx_call_ended' || message.type === 'onlinepbx_call_status') {
          setIncomingCalls(prev => prev.filter(c => c.callId !== message.data?.callId));
          refetchCalls();
        } else if (message.type === 'onlinepbx_outgoing_call') {
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
  }, [toast]);

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

    if (!onlinepbxStatus?.configured) {
      toast({
        title: "Xato",
        description: "OnlinePBX sozlanmagan. Administrator bilan bog'laning.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/calls/outgoing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber, 
          sipExtension: sipExtension || undefined 
        }),
        credentials: 'include',
      });

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

  const handleAcceptCall = async (callId: string) => {
    try {
      const response = await fetch(`/api/onlinepbx/calls/${callId}/accept`, {
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

  const handleRejectCall = async (callId: string) => {
    try {
      const response = await fetch(`/api/onlinepbx/calls/${callId}/reject`, {
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
    <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-auto">
      <div className="mb-6 slide-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Qo'ng'iroqlar</h1>
        </div>
        <p className="text-sm text-gray-500 ml-[52px]">Kiruvchi va chiquvchi qo'ng'iroqlarni boshqaring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 fade-in">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Jami Qo'ng'iroqlar</p>
              <p className="text-3xl font-bold text-gray-900">{callHistory.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Kiruvchi</p>
              <p className="text-3xl font-bold text-green-600">{callHistory.filter(c => c.direction === 'incoming').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <PhoneIncoming className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Chiquvchi</p>
              <p className="text-3xl font-bold text-purple-600">{callHistory.filter(c => c.direction === 'outgoing').length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <PhoneOutgoing className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">O'tkazib yuborilgan</p>
              <p className="text-3xl font-bold text-orange-600">{callHistory.filter(c => c.status === 'missed').length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <PhoneMissed className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 fade-in">
        <div className="lg:col-span-1">
          <WebRTCPhone />
        </div>

        <Card className="lg:col-span-1 glass-card border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <PhoneOutgoing className="w-5 h-5" />
              OnlinePBX orqali qo'ng'iroq
            </CardTitle>
            <CardDescription className="text-green-100">Telefon raqamini kiriting</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {!onlinepbxStatus?.configured && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  OnlinePBX sozlanmagan
                </div>
              )}
              
              {onlinepbxStatus?.configured && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {onlinepbxStatus.domain}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg text-center font-mono search-input"
                />
                <Button variant="ghost" size="icon" onClick={handleBackspace} className="hover:bg-red-50 hover:text-red-600">
                  <Delete className="w-5 h-5" />
                </Button>
              </div>

              <Input
                type="text"
                placeholder="SIP raqami (ixtiyoriy)"
                value={sipExtension}
                onChange={(e) => setSipExtension(e.target.value)}
                className="text-sm search-input"
              />

              <div className="grid grid-cols-3 gap-2">
                {dialerButtons.map((row, rowIndex) => (
                  row.map((digit) => (
                    <Button
                      key={`${rowIndex}-${digit}`}
                      variant="outline"
                      className="h-12 text-xl font-semibold action-button hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => handleDialerInput(digit)}
                    >
                      {digit}
                    </Button>
                  ))
                ))}
              </div>

              <Button
                className="w-full h-12 text-lg gap-2 action-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg"
                onClick={handleCall}
                disabled={!onlinepbxStatus?.configured}
              >
                <Phone className="w-5 h-5" />
                Qo'ng'iroq qilish
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle>Qo'ng'iroqlar tarixi</CardTitle>
            <CardDescription className="text-blue-100">
              So'nggi qo'ng'iroqlar ro'yxati
              {onlinepbxStatus?.configured && (
                <span className="ml-2">• OnlinePBX ulangan</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="all">
              <TabsList className="mb-4 bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Barchasi</TabsTrigger>
                <TabsTrigger value="incoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Kiruvchi</TabsTrigger>
                <TabsTrigger value="outgoing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Chiquvchi</TabsTrigger>
                <TabsTrigger value="missed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">O'tkazib yuborilgan</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <CallList calls={callHistory} />
              </TabsContent>
              <TabsContent value="incoming">
                <CallList calls={callHistory.filter(c => c.direction === 'incoming' || (!c.direction && c.status !== 'outgoing'))} />
              </TabsContent>
              <TabsContent value="outgoing">
                <CallList calls={callHistory.filter(c => c.direction === 'outgoing' || c.status === 'outgoing')} />
              </TabsContent>
              <TabsContent value="missed">
                <CallList calls={callHistory.filter(c => c.status === 'missed' || c.status === 'rejected')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {incomingCalls.length > 0 && (
        <Card className="mt-6 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl scale-in overflow-hidden">
          <CardHeader className="bg-blue-500/10">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PhoneIncoming className="w-5 h-5 animate-pulse" />
              Faol kiruvchi qo'ng'iroqlar ({incomingCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {incomingCalls.map((call) => (
                <div
                  key={call.callId}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200 shadow-sm list-item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                      <PhoneIncoming className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{call.from}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(call.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      OnlinePBX
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 action-button"
                      onClick={() => handleRejectCall(call.callId)}
                    >
                      Rad etish
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md action-button"
                      onClick={() => handleAcceptCall(call.callId)}
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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Qo'ng'iroqlar mavjud emas</p>
        <p className="text-gray-400 text-sm mt-1">Qo'ng'iroqlar tarixi bu yerda ko'rsatiladi</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-2">
        {calls.map((call, index) => (
          <div
            key={call.callId}
            className="flex items-center justify-between p-3 bg-white rounded-xl border hover:border-blue-200 hover:shadow-md transition-all duration-200"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border">
                {getStatusIcon(call.status, call.direction)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {call.direction === 'outgoing' || call.status === 'outgoing' ? call.to : call.from}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(call.timestamp)}</span>
                  <span className="text-gray-300">•</span>
                  <span>{formatTime(call.timestamp)}</span>
                  {call.duration !== undefined && call.duration > 0 && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock className="w-3 h-3" />
                        {formatDuration(call.duration)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(call.status, call.direction)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
