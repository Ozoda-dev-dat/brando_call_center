import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import memorystore from "memorystore";
import { seedUsers } from "./seed";
import { WebSocket, WebSocketServer } from "ws";
import { zadarmaService, type IncomingCallData } from "./zadarma-service";
import { ticketsService } from "./tickets-service";
import { telegramService } from "./telegram-service";

const MemoryStore = memorystore(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: 'admin' | 'operator' | 'master';
    masterId?: string | null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'brando-crm-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    },
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  });

  app.use(sessionMiddleware);

  await seedUsers();

  // --- Authentication ---
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username va parol talab qilinadi" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ message: "Login yoki parol xato" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Login yoki parol xato" });
      }

      await storage.updateUserLastLogin(user.id);

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.masterId = user.masterId || null;

      return res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        masterId: user.masterId || null,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server xatosi" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Chiqishda xatolik" });
      }
      res.json({ message: "Muvaffaqiyatli chiqildi" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Autentifikatsiya talab qilinadi" });
    }

    const user = await storage.getUser(req.session.userId);

    if (!user) {
      return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
    }

    return res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      masterId: user.masterId || null,
    });
  });

  // --- Ticket endpoints ---
  app.post('/api/tickets', async (req, res) => {
    try {
      const payload = req.body;
      const ticket = ticketsService.createTicket(payload);

      // If master assigned, send via Telegram
      if (ticket.masterId) {
        telegramService.sendOrderToMaster(ticket.masterId, ticket);
      }

      // broadcast to websocket clients
      broadcast({ type: 'ticket_created', data: ticket });

      return res.json(ticket);
    } catch (error) {
      console.error('Error creating ticket', error);
      return res.status(500).json({ message: 'Error creating ticket' });
    }
  });

  app.get('/api/tickets', (req, res) => {
    return res.json(ticketsService.list());
  });

  // --- Telegram webhook for callback queries ---
  app.post('/api/telegram/webhook', async (req, res) => {
    try {
      const update = req.body;

      if (update.callback_query) {
        const cb = update.callback_query;
        const data: string = cb.data || '';
        const parts = data.split(':');
        const action = parts[0];
        const ticketId = parts[1];
        const masterId = parts[2];

        if (!ticketId) {
          await telegramService.answerCallback(cb.id, 'Неверные данные');
          return res.sendStatus(200);
        }

        if (action === 'accept') {
          const updated = ticketsService.updateStatus(ticketId, 'accepted_by_master');
          await telegramService.answerCallback(cb.id, 'Siz buyurtmani qabul qildingiz');
          broadcast({ type: 'ticket_updated', data: updated });
        } else if (action === 'reject') {
          const updated = ticketsService.updateStatus(ticketId, 'rejected_by_master');
          await telegramService.answerCallback(cb.id, 'Siz buyurtmani rad etdiniz');
          broadcast({ type: 'ticket_updated', data: updated });
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling telegram webhook', error);
      res.sendStatus(500);
    }
  });

  // --- Twilio incoming call webhook and call management ---
  // --- Zadarma incoming call webhook and call management ---
  app.post('/api/calls/incoming', (req, res) => {
    try {
        const callData = zadarmaService.handleIncomingCall(req.body);
      broadcast({ type: 'incoming_call', data: callData });

      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>Your call has been received</Say>\n</Response>`);
    } catch (error) {
      console.error('Error handling incoming call:', error);
      res.status(500).json({ message: 'Error processing call' });
    }
  });

  app.post('/api/calls/:callSid/accept', (req, res) => {
    try {
      const { callSid } = req.params;
      const { operatorId } = req.body;

      const callData = zadarmaService.getCallData(callSid);
      if (callData) {
        callData.status = 'accepted';
        callData.operatorId = operatorId;
      }

      broadcast({ type: 'call_accepted', data: callData });

      return res.json({ message: 'Call accepted', callData });
    } catch (error) {
      console.error('Error accepting call:', error);
      return res.status(500).json({ message: 'Error accepting call' });
    }
  });

  app.post('/api/calls/:callSid/reject', async (req, res) => {
    try {
      const { callSid } = req.params;
        await zadarmaService.rejectCall(callSid);
      broadcast({ type: 'call_rejected', data: { callSid } });
      return res.json({ message: 'Call rejected' });
    } catch (error) {
      console.error('Error rejecting call:', error);
      return res.status(500).json({ message: 'Error rejecting call' });
    }
  });

  app.post('/api/calls/:callSid/end', (req, res) => {
    try {
      const { callSid } = req.params;
      const { duration } = req.body;
        zadarmaService.endCall(callSid, duration || 0);
      broadcast({ type: 'call_ended', data: { callSid, duration } });
      return res.json({ message: 'Call ended' });
    } catch (error) {
      console.error('Error ending call:', error);
      return res.status(500).json({ message: 'Error ending call' });
    }
  });

  app.get('/api/zadarma/widget-config', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const sip = process.env.ZADARMA_SIP;

    if (!sip) {
      return res.status(404).json({ message: 'Zadarma SIP not configured' });
    }

    try {
      const webrtcConfig = await zadarmaService.getWebRTCKey(sip);
      
      if (!webrtcConfig) {
        return res.status(500).json({ message: 'Failed to get WebRTC key from Zadarma' });
      }

      return res.json({ key: webrtcConfig.key, sip: webrtcConfig.sip });
    } catch (error) {
      console.error('Error getting Zadarma WebRTC config:', error);
      return res.status(500).json({ message: 'Error getting WebRTC configuration' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server and broadcast helper
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  const clients: WebSocket[] = [];

  function broadcast(message: any) {
    const text = JSON.stringify(message);
    clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        try { c.send(text); } catch (e) { console.error('WS send error', e); }
      }
    });
  }

  wss.on('connection', (ws) => {
    console.log('WS client connected');
    clients.push(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data && data.type === 'identify' && data.role === 'master' && data.masterId) {
          // In a fuller implementation we would track by role/masterId
          (ws as any).masterId = data.masterId;
        }
      } catch (e) {
        console.error('Error parsing ws message', e);
      }
    });

    ws.on('close', () => {
      const idx = clients.indexOf(ws);
      if (idx > -1) clients.splice(idx, 1);
    });

    ws.on('error', (err) => console.error('WS error', err));
  });

  return httpServer;
}
