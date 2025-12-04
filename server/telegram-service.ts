import type { Ticket } from './tickets-service';

function getEnvMasterMap() {
  const raw = process.env.MASTER_TELEGRAM_MAP || '{}';
  try { return JSON.parse(raw); } catch (e) { return {}; }
}

export class TelegramService {
  private token: string;
  private apiUrl: string;
  private masterMap: Record<string,string>;

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.apiUrl = `https://api.telegram.org/bot${this.token}`;
    this.masterMap = getEnvMasterMap();
  }

  async sendOrderToMaster(masterId: string, ticket: Ticket) {
    const chatId = this.masterMap[masterId];
    if (!chatId) {
      console.warn(`No telegram chatId configured for master ${masterId}`);
      return;
    }

    const text = `Yangi buyurtma: #${ticket.number}\nMijoz: ${ticket.customerName} (${ticket.customerPhone})\nManzil: ${ticket.customerAddress || '—'}\nMuammo: ${ticket.issueDescription || '—'}`;

    const keyboard = {
      inline_keyboard: [[
        { text: 'Qabul qilaman', callback_data: `accept:${ticket.id}:${masterId}` },
        { text: 'Rad etaman', callback_data: `reject:${ticket.id}:${masterId}` }
      ]]
    };

    try {
      await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, reply_markup: keyboard }),
      });
    } catch (error) {
      console.error('Error sending telegram message', error);
    }
  }

  async answerCallback(callbackQueryId: string, text?: string) {
    try {
      await fetch(`${this.apiUrl}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
      });
    } catch (error) {
      console.error('Error answering callback query', error);
    }
  }

  setMasterMap(map: Record<string,string>) {
    this.masterMap = map;
  }
}

export const telegramService = new TelegramService();
