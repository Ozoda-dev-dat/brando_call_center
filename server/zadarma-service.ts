import crypto from 'crypto';

export interface CallData {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
  operatorId?: string;
  status: 'incoming' | 'outgoing' | 'accepted' | 'rejected' | 'ended' | 'missed';
  duration?: number;
  direction: 'incoming' | 'outgoing';
}

export type IncomingCallData = CallData;

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
   * Algorithm: HMAC-SHA1(method + paramsString + MD5(paramsString), secret) -> Base64
   */
  private generateApiSignature(method: string, paramsString: string): string {
    const md5Hash = crypto
      .createHash('md5')
      .update(paramsString)
      .digest('hex');

    const signatureString = method + paramsString + md5Hash;

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
      
      // Build sorted query string (for simple params, just sip=value)
      const paramsString = `sip=${sipExtension}`;
      
      // Generate signature using the exact params string
      const signature = this.generateApiSignature(method, paramsString);

      console.log('Zadarma API request:', {
        method,
        paramsString,
        apiKey: this.apiKey.substring(0, 8) + '...',
      });

      const response = await fetch(`https://api.zadarma.com${method}?${paramsString}`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}:${signature}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success' && data.key) {
        console.log('Zadarma WebRTC key obtained successfully');
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
  handleIncomingCall(params: Record<string, string>): CallData | null {
    const callId = params.call_id || `call_${Date.now()}`;
    const from = params.caller || 'Unknown';
    const to = params.to || '';

    const callData: CallData = {
      callId,
      from,
      to,
      timestamp: new Date(),
      status: 'incoming',
      direction: 'incoming',
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
   * Record an outgoing call initiated by an operator
   */
  recordOutgoingCall(phoneNumber: string, operatorId: string): CallData {
    const callId = `out_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const callData: CallData = {
      callId,
      from: operatorId,
      to: phoneNumber,
      timestamp: new Date(),
      operatorId,
      status: 'outgoing',
      direction: 'outgoing',
    };

    this.incomingCalls.set(callId, callData);
    return callData;
  }

  /**
   * Get list of all active/recent calls for admin dashboard
   */
  listCalls(): CallData[] {
    return Array.from(this.incomingCalls.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const zadarmaService = new ZadarmaService();
