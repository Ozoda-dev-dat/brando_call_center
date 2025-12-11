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

class OnlinePBXService {
  private domain: string;
  private authKey: string;
  private baseUrl: string;
  private activeCalls: Map<string, OnlinePBXCallData> = new Map();
  
  private secretKey: string | null = null;
  private secretKeyId: string | null = null;
  private authExpiry: number = 0;

  constructor() {
    let domain = process.env.ONLINEPBX_DOMAIN || '';
    if (domain && !domain.includes('.')) {
      domain = `${domain}.onpbx.ru`;
    }
    // Remove trailing slash for consistent handling
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    this.domain = domain;
    this.authKey = process.env.ONLINEPBX_API_KEY || '';
    // Note: baseUrl does NOT have trailing slash, we add it when making requests
    this.baseUrl = `https://api.onlinepbx.ru/${this.domain}`;
  }

  isConfigured(): boolean {
    return !!(this.domain && this.authKey);
  }

  private async authenticate(): Promise<boolean> {
    if (this.secretKey && this.secretKeyId && Date.now() < this.authExpiry) {
      return true;
    }

    try {
      console.log('OnlinePBX: Authenticating...');
      const response = await fetch(`${this.baseUrl}/auth.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `auth_key=${encodeURIComponent(this.authKey)}`,
      });

      const data = await response.json();
      console.log('OnlinePBX auth response:', JSON.stringify(data));

      if (data.status === 1 || data.status === '1' || data.status === 'success') {
        this.secretKey = data.data?.key || data.key;
        this.secretKeyId = data.data?.key_id || data.key_id;
        // Secret key has a lifespan of 3 days, but we refresh more frequently to be safe
        this.authExpiry = Date.now() + (24 * 60 * 60 * 1000); // 1 day
        console.log('OnlinePBX: Authentication successful, key_id:', this.secretKeyId);
        return true;
      }

      console.error('OnlinePBX authentication failed:', data);
      return false;
    } catch (error) {
      console.error('OnlinePBX auth error:', error);
      return false;
    }
  }

  private createSignature(method: string, path: string, body: string, date: string): string {
    if (!this.secretKey) {
      throw new Error('No secret key available');
    }

    const contentType = 'application/x-www-form-urlencoded';
    const contentMd5 = crypto.createHash('md5').update(body).digest('hex');
    const signUrl = `api.onlinepbx.ru/${this.domain}/${path}`;
    const signData = `${method}\n${contentMd5}\n${contentType}\n${date}\n${signUrl}\n`;
    
    const hexHmac = crypto
      .createHmac('sha1', this.secretKey)
      .update(signData)
      .digest('hex');
    
    const signature = Buffer.from(hexHmac).toString('base64');

    return signature;
  }

  private async sendRequest(path: string, params: Record<string, string> = {}): Promise<any> {
    if (!this.isConfigured()) {
      console.error('OnlinePBX not configured');
      return null;
    }

    const authenticated = await this.authenticate();
    if (!authenticated) {
      console.error('OnlinePBX: Failed to authenticate');
      return null;
    }

    try {
      const date = new Date().toUTCString();
      const body = new URLSearchParams(params).toString();
      const signature = this.createSignature('POST', path, body, date);
      const contentMd5 = crypto.createHash('md5').update(body).digest('hex');

      const response = await fetch(`${this.baseUrl}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Date': date,
          'Content-MD5': contentMd5,
          'x-pbx-authentication': `${this.secretKeyId}:${signature}`,
        },
        body: body,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`OnlinePBX request error for ${path}:`, error);
      return null;
    }
  }

  async getCallHistory(dateFrom?: Date, dateTo?: Date): Promise<OnlinePBXCallHistoryItem[]> {
    const from = dateFrom || new Date(Date.now() - 24 * 60 * 60 * 1000);
    const to = dateTo || new Date();

    // OnlinePBX API requires RFC-2822 date format
    const params: Record<string, string> = {
      date_from: from.toUTCString(),
      date_to: to.toUTCString(),
    };

    // Use correct endpoint: history/search.json (not mongo_history/search.json)
    const data = await this.sendRequest('history/search.json', params);

    if (data && (data.status === 1 || data.status === '1' || data.status === 'success') && data.data) {
      return data.data;
    }

    console.error('OnlinePBX call history error:', data);
    return [];
  }

  async initiateCall(from: string, to: string): Promise<OnlinePBXCallData | null> {
    const params: Record<string, string> = {
      from: from,
      to: to,
    };

    // Use correct endpoint: call/now.json for immediate calls (not make_call/request.json)
    const data = await this.sendRequest('call/now.json', params);
    console.log('OnlinePBX call/now response:', JSON.stringify(data));

    if (data && (data.status === 1 || data.status === '1' || data.status === 'success')) {
      const callId = data.data?.call_id || data.call_id || `opbx_${Date.now()}`;
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
  }

  verifyWebhookSignature(params: Record<string, string>, signature: string): boolean {
    const webhookSecret = process.env.ONLINEPBX_WEBHOOK_SECRET || '';
    
    if (!webhookSecret) {
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
      .createHmac('sha256', webhookSecret)
      .update(queryString)
      .digest('hex');

    if (computed !== signature) {
      const queryStringWithoutEncode = sortedKeys
        .map(k => `${k}=${params[k]}`)
        .join('&');

      const computedAlt = crypto
        .createHmac('sha256', webhookSecret)
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
    // Use correct endpoint: user/get.json for user list (not sip/list.json)
    const data = await this.sendRequest('user/get.json', {});
    
    if (data && (data.status === 1 || data.status === '1' || data.status === 'success')) {
      return data.data || [];
    }
    
    console.error('Failed to get OnlinePBX extensions:', data);
    return [];
  }

  getDomain(): string {
    return this.domain;
  }
}

export const onlinePBXService = new OnlinePBXService();
