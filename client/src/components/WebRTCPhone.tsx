import { useState, useEffect, useRef, useCallback } from 'react';
import { UserAgent, Registerer, Inviter, Invitation, SessionState, RegistererState } from 'sip.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  PhoneIncoming,
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  Delete
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SIPConfig {
  server: string;
  username: string;
  password: string;
  domain: string;
}

type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'incoming';

export function WebRTCPhone() {
  const { toast } = useToast();
  const [config, setConfig] = useState<SIPConfig>(() => {
    const saved = localStorage.getItem('sip_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { server: '', username: '', password: '', domain: '' };
      }
    }
    return { server: '', username: '', password: '', domain: '' };
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [callState, setCallState] = useState<CallState>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCallerNumber, setIncomingCallerNumber] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const userAgentRef = useRef<UserAgent | null>(null);
  const registererRef = useRef<Registerer | null>(null);
  const sessionRef = useRef<Inviter | Invitation | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveConfig = (newConfig: SIPConfig) => {
    setConfig(newConfig);
    localStorage.setItem('sip_config', JSON.stringify(newConfig));
  };

  const cleanupSession = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    sessionRef.current = null;
    setCallState('idle');
    setCallDuration(0);
    setIncomingCallerNumber('');
    setIsMuted(false);
  }, []);

  const setupRemoteMedia = useCallback((session: Inviter | Invitation) => {
    const sessionDescriptionHandler = session.sessionDescriptionHandler;
    if (!sessionDescriptionHandler) return;

    const peerConnection = (sessionDescriptionHandler as any).peerConnection as RTCPeerConnection;
    if (!peerConnection) return;

    peerConnection.getReceivers().forEach((receiver) => {
      if (receiver.track && receiver.track.kind === 'audio') {
        if (!remoteAudioRef.current) {
          remoteAudioRef.current = new Audio();
          remoteAudioRef.current.autoplay = true;
        }
        const stream = new MediaStream([receiver.track]);
        remoteAudioRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleIncomingCall = useCallback((invitation: Invitation) => {
    sessionRef.current = invitation;
    const callerNumber = invitation.remoteIdentity.uri.user || 'Unknown';
    setIncomingCallerNumber(callerNumber);
    setCallState('incoming');

    invitation.stateChange.addListener((state) => {
      switch (state) {
        case SessionState.Establishing:
          setCallState('ringing');
          break;
        case SessionState.Established:
          setCallState('connected');
          setupRemoteMedia(invitation);
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
          break;
        case SessionState.Terminated:
          cleanupSession();
          break;
      }
    });
  }, [cleanupSession, setupRemoteMedia]);

  const connect = useCallback(async () => {
    if (!config.server || !config.username || !config.password || !config.domain) {
      toast({
        title: 'Xato',
        description: 'SIP sozlamalarini to\'ldiring',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    setIsConnecting(true);

    try {
      const uri = UserAgent.makeURI(`sip:${config.username}@${config.domain}`);
      if (!uri) throw new Error('Invalid SIP URI');

      const transportOptions = {
        server: config.server.startsWith('wss://') ? config.server : `wss://${config.server}`,
      };

      const userAgent = new UserAgent({
        uri,
        transportOptions,
        authorizationUsername: config.username,
        authorizationPassword: config.password,
        displayName: config.username,
        delegate: {
          onInvite: handleIncomingCall,
        },
      });

      userAgentRef.current = userAgent;

      userAgent.transport.stateChange.addListener((state) => {
        if (state === 'Connected') {
          setIsConnected(true);
        } else if (state === 'Disconnected') {
          setIsConnected(false);
          setIsRegistered(false);
        }
      });

      await userAgent.start();

      const registerer = new Registerer(userAgent);
      registererRef.current = registerer;

      registerer.stateChange.addListener((state) => {
        if (state === RegistererState.Registered) {
          setIsRegistered(true);
          toast({
            title: 'Ulandi',
            description: 'SIP serverga muvaffaqiyatli ulandi',
          });
        } else if (state === RegistererState.Unregistered) {
          setIsRegistered(false);
        }
      });

      await registerer.register();
    } catch (error) {
      console.error('SIP connection error:', error);
      toast({
        title: 'Ulanish xatosi',
        description: error instanceof Error ? error.message : 'SIP serverga ulanib bo\'lmadi',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [config, handleIncomingCall, toast]);

  const disconnect = useCallback(async () => {
    try {
      if (sessionRef.current) {
        if (sessionRef.current instanceof Invitation) {
          sessionRef.current.reject();
        } else {
          sessionRef.current.bye();
        }
      }
      
      if (registererRef.current) {
        await registererRef.current.unregister();
      }
      
      if (userAgentRef.current) {
        await userAgentRef.current.stop();
      }
      
      cleanupSession();
      setIsConnected(false);
      setIsRegistered(false);
      
      toast({
        title: 'Uzildi',
        description: 'SIP serverdan uzildi',
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, [cleanupSession, toast]);

  const makeCall = useCallback(async () => {
    if (!userAgentRef.current || !isRegistered || !phoneNumber) {
      toast({
        title: 'Xato',
        description: 'Telefon raqamini kiriting',
        variant: 'destructive',
      });
      return;
    }

    try {
      const target = UserAgent.makeURI(`sip:${phoneNumber}@${config.domain}`);
      if (!target) throw new Error('Invalid phone number');

      const inviter = new Inviter(userAgentRef.current, target, {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false,
          },
        },
      });

      sessionRef.current = inviter;

      inviter.stateChange.addListener((state) => {
        switch (state) {
          case SessionState.Establishing:
            setCallState('calling');
            break;
          case SessionState.Established:
            setCallState('connected');
            setupRemoteMedia(inviter);
            callTimerRef.current = setInterval(() => {
              setCallDuration(prev => prev + 1);
            }, 1000);
            break;
          case SessionState.Terminated:
            cleanupSession();
            break;
        }
      });

      await inviter.invite();
    } catch (error) {
      console.error('Call error:', error);
      toast({
        title: 'Qo\'ng\'iroq xatosi',
        description: error instanceof Error ? error.message : 'Qo\'ng\'iroq qilib bo\'lmadi',
        variant: 'destructive',
      });
      cleanupSession();
    }
  }, [config.domain, isRegistered, phoneNumber, cleanupSession, setupRemoteMedia, toast]);

  const answerCall = useCallback(async () => {
    if (!sessionRef.current || !(sessionRef.current instanceof Invitation)) return;

    try {
      await sessionRef.current.accept({
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false,
          },
        },
      });
    } catch (error) {
      console.error('Answer error:', error);
      toast({
        title: 'Xato',
        description: 'Qo\'ng\'iroqqa javob berib bo\'lmadi',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const rejectCall = useCallback(() => {
    if (!sessionRef.current || !(sessionRef.current instanceof Invitation)) return;
    sessionRef.current.reject();
    cleanupSession();
  }, [cleanupSession]);

  const hangupCall = useCallback(() => {
    if (!sessionRef.current) return;

    try {
      if (sessionRef.current instanceof Invitation) {
        if (sessionRef.current.state === SessionState.Established) {
          sessionRef.current.bye();
        } else {
          sessionRef.current.reject();
        }
      } else {
        if (sessionRef.current.state === SessionState.Established) {
          sessionRef.current.bye();
        } else {
          sessionRef.current.cancel();
        }
      }
    } catch (error) {
      console.error('Hangup error:', error);
    }
    cleanupSession();
  }, [cleanupSession]);

  const toggleMute = useCallback(() => {
    if (!sessionRef.current) return;

    const sessionDescriptionHandler = sessionRef.current.sessionDescriptionHandler;
    if (!sessionDescriptionHandler) return;

    const peerConnection = (sessionDescriptionHandler as any).peerConnection as RTCPeerConnection;
    if (!peerConnection) return;

    peerConnection.getSenders().forEach((sender) => {
      if (sender.track && sender.track.kind === 'audio') {
        sender.track.enabled = isMuted;
      }
    });

    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleSpeaker = useCallback(() => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !isSpeakerOff;
    }
    setIsSpeakerOff(!isSpeakerOff);
  }, [isSpeakerOff]);

  const dialPadPress = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  const dialPadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            WebRTC Telefon
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isRegistered ? 'default' : isConnected ? 'secondary' : 'outline'}>
              {isRegistered ? 'Tayyor' : isConnected ? 'Ulanmoqda...' : 'Uzilgan'}
            </Badge>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>SIP Sozlamalari</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>WebSocket Server</Label>
                    <Input
                      placeholder="wss://pbx.example.com:8089/ws"
                      value={config.server}
                      onChange={(e) => saveConfig({ ...config, server: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Domain</Label>
                    <Input
                      placeholder="pbx.example.com"
                      value={config.domain}
                      onChange={(e) => saveConfig({ ...config, domain: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Extension (Foydalanuvchi)</Label>
                    <Input
                      placeholder="100"
                      value={config.username}
                      onChange={(e) => saveConfig({ ...config, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parol</Label>
                    <Input
                      type="password"
                      placeholder="SIP parol"
                      value={config.password}
                      onChange={(e) => saveConfig({ ...config, password: e.target.value })}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowSettings(false)}
                  >
                    Saqlash
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRegistered && (
          <Button 
            className="w-full" 
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Ulanmoqda...' : isConnected ? 'Uzish' : 'Ulash'}
          </Button>
        )}

        {isRegistered && callState === 'idle' && (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Telefon raqami"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPhoneNumber(prev => prev.slice(0, -1))}
                disabled={!phoneNumber}
              >
                <Delete className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {dialPadButtons.map((row, rowIndex) => (
                row.map((digit) => (
                  <Button
                    key={digit}
                    variant="outline"
                    className="h-12 text-lg font-medium"
                    onClick={() => dialPadPress(digit)}
                  >
                    {digit}
                  </Button>
                ))
              ))}
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={makeCall}
              disabled={!phoneNumber}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Qo'ng'iroq qilish
            </Button>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={disconnect}
            >
              Uzish
            </Button>
          </>
        )}

        {callState === 'incoming' && (
          <div className="space-y-4 text-center">
            <div className="animate-pulse">
              <PhoneIncoming className="h-12 w-12 mx-auto text-blue-500" />
            </div>
            <p className="text-lg font-medium">Kiruvchi qo'ng'iroq</p>
            <p className="text-2xl font-bold">{incomingCallerNumber}</p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14"
                onClick={answerCall}
              >
                <Phone className="h-6 w-6" />
              </Button>
              <Button
                variant="destructive"
                className="rounded-full h-14 w-14"
                onClick={rejectCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {(callState === 'calling' || callState === 'ringing') && (
          <div className="space-y-4 text-center">
            <div className="animate-pulse">
              <PhoneCall className="h-12 w-12 mx-auto text-green-500" />
            </div>
            <p className="text-lg font-medium">
              {callState === 'calling' ? 'Qo\'ng\'iroq qilinmoqda...' : 'Jiringlamoqda...'}
            </p>
            <p className="text-2xl font-bold">{phoneNumber}</p>
            <Button
              variant="destructive"
              className="rounded-full h-14 w-14"
              onClick={hangupCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        )}

        {callState === 'connected' && (
          <div className="space-y-4 text-center">
            <div>
              <Phone className="h-12 w-12 mx-auto text-green-500" />
            </div>
            <p className="text-lg font-medium">Suhbat davom etmoqda</p>
            <p className="text-2xl font-bold">{phoneNumber || incomingCallerNumber}</p>
            <p className="text-xl font-mono text-muted-foreground">{formatDuration(callDuration)}</p>
            
            <div className="flex gap-4 justify-center">
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                className="rounded-full h-12 w-12"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant="destructive"
                className="rounded-full h-14 w-14"
                onClick={hangupCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              <Button
                variant={isSpeakerOff ? 'destructive' : 'outline'}
                className="rounded-full h-12 w-12"
                onClick={toggleSpeaker}
              >
                {isSpeakerOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
