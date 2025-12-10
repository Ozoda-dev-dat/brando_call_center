import crypto from 'crypto';

export interface OnlinePBXCallData {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
  operatorId?: string;
  status: 'incoming' | 'outgoing' | 'accepted' | 'rejected' | 'ended' | 'missed' | 'ringing';
  duration?: number;
  direction: 'incoming' | 'outgoing';
  recordingUrl?: string;
  provider: 'onlinepbx';
}

export interface OnlinePBXCallHistoryItem {
  call_id: string;
  caller: string;
  called: string;
  start: string;
  duration: number;
  direction: 'in' | 'out';
  status: string;
  record?: string;
}

export interface OnlinePBXAuthResponse {
  status: string;
  key_id: string;
  key: string;
}

class OnlinePBXService {
  private domain: string;
  private keyId: string;
  private keySecret: string;
  private baseUrl: string;
  private activeCalls: Map<string, OnlinePBXCallData> = new Map();

  constructor() {
    let domain = process.env.ONLINEPBX_DOMAIN || '';
    if (domain && !domain.includes('.')) {
      domain = `${domain}.onpbx.ru`;
    }
    this.domain = domain;
    
    const apiKey = process.env.ONLINEPBX_API_KEY || '';
    if (apiKey.includes(':')) {
      const [keyId, keySecret] = apiKey.split(':', 2);
      this.keyId = keyId;
      this.keySecret = keySecret;
    } else {
      this.keyId = apiKey;
      this.keySecret = process.env.ONLINEPBX_WEBHOOK_SECRET || apiKey;
    }
    
    this.baseUrl = `https://api2.onlinepbx.ru/${this.domain}`;
  }

  isConfigured(): boolean {
    return !!(this.domain && this.keyId);
  }

  private getAuthHeader(): string {
    if (this.keyId && this.keySecret && this.keyId !== this.keySecret) {
      return `${this.keyId}:${this.keySecret}`;
    }
    return this.keyId;
  }

  async authenticate(apiUserKey: string, apiSecret: string): Promise<OnlinePBXAuthResponse | null> {
    try {
      const response = await fetch(`https://api2.onlinepbx.ru/${this.domain}/auth.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `auth_user_key=${encodeURIComponent(apiUserKey)}&auth_user_secret=${encodeURIComponent(apiSecret)}`,
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return data;
      }
      
      console.error('OnlinePBX authentication failed:', data);
      return null;
    } catch (error) {
      console.error('OnlinePBX auth error:', error);
      return null;
    }
  }

  async getCallHistory(dateFrom?: Date, dateTo?: Date): Promise<OnlinePBXCallHistoryItem[]> {
    if (!this.isConfigured()) {
      console.error('OnlinePBX not configured');
      return [];
    }

    try {
      const from = dateFrom || new Date(Date.now() - 24 * 60 * 60 * 1000);
      const to = dateTo || new Date();

      const params = new URLSearchParams({
        date_from: from.toISOString(),
        date_to: to.toISOString(),
      });

      const response = await fetch(`${this.baseUrl}/mongo_history/search.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-pbx-authentication': this.getAuthHeader(),
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        return data.data;
      }

      console.error('OnlinePBX call history error:', data);
      return [];
    } catch (error) {
      console.error('Failed to get OnlinePBX call history:', error);
      return [];
    }
  }

  async initiateCall(from: string, to: string): Promise<OnlinePBXCallData | null> {
    if (!this.isConfigured()) {
      console.error('OnlinePBX not configured');
      return null;
    }

    try {
      const params = new URLSearchParams({
        from: from,
        to: to,
      });

      const response = await fetch(`${this.baseUrl}/make_call/request.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-pbx-authentication': this.getAuthHeader(),
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const callId = data.call_id || `opbx_${Date.now()}`;
        const callData: OnlinePBXCallData = {
          callId,
          from,
          to,
          timestamp: new Date(),
          status: 'outgoing',
          direction: 'outgoing',
          provider: 'onlinepbx',
        };
        
        this.activeCalls.set(callId, callData);
        return callData;
      }

      console.error('OnlinePBX initiate call error:', data);
      return null;
    } catch (error) {
      console.error('Failed to initiate OnlinePBX call:', error);
      return null;
    }
  }

  verifyWebhookSignature(params: Record<string, string>, signature: string): boolean {
    if (!this.keySecret) {
      console.error('OnlinePBX webhook secret not configured, rejecting webhook');
      return false;
    }

    if (!signature) {
      console.warn('No signature provided in webhook request');
      return false;
    }

    const sortedKeys = Object.keys(params)
      .filter(k => k !== 'signature')
      .sort();
    
    const queryString = sortedKeys
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');

    const computed = crypto
      .createHmac('sha256', this.keySecret)
      .update(queryString)
      .digest('hex');

    if (computed !== signature) {
      const queryStringWithoutEncode = sortedKeys
        .map(k => `${k}=${params[k]}`)
        .join('&');
      
      const computedAlt = crypto
        .createHmac('sha256', this.keySecret)
        .update(queryStringWithoutEncode)
        .digest('hex');
      
      if (computedAlt === signature) {
        return true;
      }
      
      console.warn('OnlinePBX webhook signature mismatch');
      return false;
    }

    return true;
  }

  handleIncomingCallWebhook(params: Record<string, string>): OnlinePBXCallData | null {
    const callId = params.call_id || `opbx_in_${Date.now()}`;
    const from = params.caller_id || params.from || 'Unknown';
    const to = params.called_did || params.to || '';

    const callData: OnlinePBXCallData = {
      callId,
      from,
      to,
      timestamp: new Date(),
      status: 'incoming',
      direction: 'incoming',
      provider: 'onlinepbx',
    };

    this.activeCalls.set(callId, callData);
    return callData;
  }

  handleCallStatusWebhook(params: Record<string, string>): OnlinePBXCallData | null {
    const callId = params.call_id;
    if (!callId) return null;

    let callData = this.activeCalls.get(callId);
    
    if (!callData) {
      const from = params.caller_id || params.from || 'Unknown';
      const to = params.called_did || params.to || '';
      const direction = params.direction === 'out' ? 'outgoing' : 'incoming';
      
      callData = {
        callId,
        from,
        to,
        timestamp: new Date(params.start || Date.now()),
        status: direction === 'outgoing' ? 'outgoing' : 'incoming',
        direction,
        provider: 'onlinepbx',
      };
      this.activeCalls.set(callId, callData);
    }

    const event = params.event || params.status;
    
    switch (event) {
      case 'ANSWER':
      case 'answered':
        callData.status = 'accepted';
        break;
      case 'HANGUP':
      case 'hangup':
      case 'ended':
        callData.status = 'ended';
        callData.duration = parseInt(params.duration || '0', 10);
        break;
      case 'CANCEL':
      case 'cancel':
      case 'missed':
        callData.status = 'missed';
        break;
      case 'RINGING':
      case 'ringing':
        callData.status = 'ringing';
        break;
    }

    if (params.record_url) {
      callData.recordingUrl = params.record_url;
    }

    return callData;
  }

  acceptCall(callId: string, operatorId: string): OnlinePBXCallData | undefined {
    const callData = this.activeCalls.get(callId);
    if (callData) {
      callData.status = 'accepted';
      callData.operatorId = operatorId;
    }
    return callData;
  }

  rejectCall(callId: string): OnlinePBXCallData | undefined {
    const callData = this.activeCalls.get(callId);
    if (callData) {
      callData.status = 'rejected';
    }
    return callData;
  }

  endCall(callId: string, duration?: number): OnlinePBXCallData | undefined {
    const callData = this.activeCalls.get(callId);
    if (callData) {
      callData.status = 'ended';
      if (duration !== undefined) {
        callData.duration = duration;
      }
    }
    return callData;
  }

  getCallData(callId: string): OnlinePBXCallData | undefined {
    return this.activeCalls.get(callId);
  }

  listCalls(): OnlinePBXCallData[] {
    return Array.from(this.activeCalls.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getExtensions(): Promise<any[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/sip/list.json`, {
        method: 'POST',
        headers: {
          'x-pbx-authentication': this.getAuthHeader(),
        },
      });

      const data = await response.json();
      return data.status === 'success' ? data.data : [];
    } catch (error) {
      console.error('Failed to get OnlinePBX extensions:', error);
      return [];
    }
  }

  getDomain(): string {
    return this.domain;
  }
}

export const onlinePBXService = new OnlinePBXService();
