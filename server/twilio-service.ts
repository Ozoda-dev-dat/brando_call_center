import twilio from 'twilio';

export interface IncomingCallData {
  callSid: string;
  from: string;
  to: string;
  callerId: string;
  timestamp: Date;
  operatorId?: string;
  status: 'incoming' | 'accepted' | 'rejected' | 'ended';
  duration?: number;
}

interface ITwilioService {
  initialize(): void;
  handleIncomingCall(data: any): IncomingCallData;
  rejectCall(callSid: string): Promise<void>;
  transferCall(callSid: string, targetNumber: string): Promise<void>;
}

class TwilioService implements ITwilioService {
  private client: any;
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;
  private incomingCalls: Map<string, IncomingCallData> = new Map();

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  initialize(): void {
    if (!this.accountSid || !this.authToken) {
      console.warn('Twilio credentials not configured. Using mock mode.');
      return;
    }

    this.client = twilio(this.accountSid, this.authToken);
    console.log('Twilio service initialized');
  }

  handleIncomingCall(data: any): IncomingCallData {
    const callData: IncomingCallData = {
      callSid: data.CallSid || `MOCK-${Date.now()}`,
      from: data.From || '+998900000000',
      to: data.To || this.phoneNumber,
      callerId: data.From || '+998900000000',
      timestamp: new Date(),
      status: 'incoming',
    };

    this.incomingCalls.set(callData.callSid, callData);
    return callData;
  }

  async rejectCall(callSid: string): Promise<void> {
    const callData = this.incomingCalls.get(callSid);
    if (callData) {
      callData.status = 'rejected';
    }

    if (!this.client) return;

    try {
      // In production, implement call rejection logic
      console.log(`Rejecting call: ${callSid}`);
    } catch (error) {
      console.error('Error rejecting call:', error);
      throw error;
    }
  }

  async transferCall(callSid: string, targetNumber: string): Promise<void> {
    const callData = this.incomingCalls.get(callSid);
    if (callData) {
      callData.status = 'accepted';
    }

    if (!this.client) return;

    try {
      // In production, implement call transfer logic
      console.log(`Transferring call ${callSid} to ${targetNumber}`);
    } catch (error) {
      console.error('Error transferring call:', error);
      throw error;
    }
  }

  getCallData(callSid: string): IncomingCallData | undefined {
    return this.incomingCalls.get(callSid);
  }

  endCall(callSid: string, duration: number): void {
    const callData = this.incomingCalls.get(callSid);
    if (callData) {
      callData.status = 'ended';
      callData.duration = duration;
    }
  }
}

export const twilioService = new TwilioService();
