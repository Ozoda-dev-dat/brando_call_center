import crypto from 'crypto';

export interface IncomingCallData {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
  operatorId?: string;
  status: 'incoming' | 'accepted' | 'rejected' | 'ended';
  duration?: number;
}

export interface WebRTCKeyResponse {
  key: string;
  sip: string;
}

class ZadarmaService {
  private apiKey: string;
  private apiSecret: string;
  private incomingCalls: Map<string, IncomingCallData> = new Map();

  constructor() {
    this.apiKey = process.env.ZADARMA_API_KEY || '';
    this.apiSecret = process.env.ZADARMA_API_SECRET || '';
  }

  /**
   * Generate Zadarma API signature for authenticated requests
   */
  private generateApiSignature(method: string, params: Record<string, string> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const signatureString = method + sortedParams + crypto
      .createHash('md5')
      .update(sortedParams)
      .digest('hex');

    return crypto
      .createHmac('sha1', this.apiSecret)
      .update(signatureString)
      .digest('base64');
  }

  /**
   * Get dynamic WebRTC key from Zadarma API
   * Must be called on each page load as per Zadarma's requirements
   */
  async getWebRTCKey(sipExtension: string): Promise<WebRTCKeyResponse | null> {
    if (!this.apiKey || !this.apiSecret) {
      console.error('Zadarma API credentials not configured');
      return null;
    }

    try {
      const method = '/v1/webrtc/get_key/';
      const params = { sip: sipExtension };
      const signature = this.generateApiSignature(method, params);

      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key as keyof typeof params])}`)
        .join('&');

      const response = await fetch(`https://api.zadarma.com${method}?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}:${signature}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success' && data.key) {
        return {
          key: data.key,
          sip: sipExtension,
        };
      } else {
        console.error('Zadarma API error:', data);
        return null;
      }
    } catch (error) {
      console.error('Failed to get WebRTC key from Zadarma:', error);
      return null;
    }
  }

  /**
   * Verify Zadarma webhook signature
   * Zadarma sends: callback_url?event=inbound_call&...&signature=HMAC-MD5
   */
  verifySignature(params: Record<string, string>, signature: string): boolean {
    if (!this.apiSecret) {
      console.warn('ZADARMA_API_SECRET not configured, skipping signature verification');
      return true;
    }

    // Sort params by key and build query string (excluding signature)
    const sortedKeys = Object.keys(params)
      .filter(k => k !== 'signature')
      .sort();
    
    const queryString = sortedKeys
      .map(k => `${k}=${params[k]}`)
      .join('&');

    // Compute HMAC-MD5
    const computed = crypto
      .createHmac('md5', this.apiSecret)
      .update(queryString)
      .digest('hex');

    return computed === signature;
  }

  /**
   * Handle incoming call webhook from Zadarma
   * event=inbound_call, caller=+998..., to=12345 (your PBX number), etc.
   */
  handleIncomingCall(params: Record<string, string>): IncomingCallData | null {
    const callId = params.call_id || `call_${Date.now()}`;
    const from = params.caller || 'Unknown';
    const to = params.to || '';

    const callData: IncomingCallData = {
      callId,
      from,
      to,
      timestamp: new Date(),
      status: 'incoming',
    };

    this.incomingCalls.set(callId, callData);
    return callData;
  }

  async rejectCall(callId: string): Promise<void> {
    const callData = this.incomingCalls.get(callId);
    if (callData) {
      callData.status = 'rejected';
    }

    // In production, you could use Zadarma API to hangup if needed
    console.log(`Call ${callId} rejected`);
  }

  async acceptCall(callId: string, operatorId: string): Promise<void> {
    const callData = this.incomingCalls.get(callId);
    if (callData) {
      callData.status = 'accepted';
      callData.operatorId = operatorId;
    }

    console.log(`Call ${callId} accepted by operator ${operatorId}`);
  }

  getCallData(callId: string): IncomingCallData | undefined {
    return this.incomingCalls.get(callId);
  }

  endCall(callId: string, duration: number): void {
    const callData = this.incomingCalls.get(callId);
    if (callData) {
      callData.status = 'ended';
      callData.duration = duration;
    }
  }

  /**
   * Get list of all active/recent calls for admin dashboard
   */
  listCalls(): IncomingCallData[] {
    return Array.from(this.incomingCalls.values());
  }
}

export const zadarmaService = new ZadarmaService();
