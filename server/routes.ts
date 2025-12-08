import type { Express } from "express";
import { createServer, type Server, ServerResponse } from "http";
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
  const isProduction = process.env.NODE_ENV === 'production';
  
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'brando-crm-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
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

  // --- Ticket/Order endpoints ---
  app.post('/api/tickets', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const payload = req.body;
      const order = await ticketsService.createOrder(payload);

      if (order.masterId) {
        telegramService.sendOrderToMaster(String(order.masterId), order);
      }

      broadcast({ type: 'ticket_created', data: order });

      return res.json(order);
    } catch (error) {
      console.error('Error creating order', error);
      return res.status(500).json({ message: 'Error creating order' });
    }
  });

  app.get('/api/tickets', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const tickets = await ticketsService.list();
      return res.json(tickets);
    } catch (error: any) {
      console.error('Error listing tickets:', error?.message || error);
      return res.status(500).json({ message: 'Error listing tickets', error: error?.message });
    }
  });

  app.get('/api/tickets/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const order = await ticketsService.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.json(order);
    } catch (error) {
      console.error('Error getting order', error);
      return res.status(500).json({ message: 'Error getting order' });
    }
  });

  app.patch('/api/tickets/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const order = await ticketsService.updateOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      broadcast({ type: 'ticket_updated', data: order });
      return res.json(order);
    } catch (error) {
      console.error('Error updating order', error);
      return res.status(500).json({ message: 'Error updating order' });
    }
  });

  app.patch('/api/tickets/:id/status', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const { status } = req.body;
      const order = await ticketsService.updateStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      broadcast({ type: 'ticket_updated', data: order });
      return res.json(order);
    } catch (error) {
      console.error('Error updating order status', error);
      return res.status(500).json({ message: 'Error updating order status' });
    }
  });

  app.delete('/api/tickets/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete orders' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      await ticketsService.delete(id);
      broadcast({ type: 'ticket_deleted', data: { id } });
      return res.json({ message: 'Order deleted' });
    } catch (error) {
      console.error('Error deleting order', error);
      return res.status(500).json({ message: 'Error deleting order' });
    }
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

        const orderId = parseInt(ticketId, 10);
        if (isNaN(orderId)) {
          await telegramService.answerCallback(cb.id, 'Неверный ID');
          return res.sendStatus(200);
        }

        if (action === 'accept') {
          const updated = await ticketsService.updateStatus(orderId, 'in_progress');
          await telegramService.answerCallback(cb.id, 'Siz buyurtmani qabul qildingiz');
          broadcast({ type: 'ticket_updated', data: updated });
        } else if (action === 'reject') {
          const updated = await ticketsService.updateStatus(orderId, 'new');
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

  // --- List all calls for admin dashboard ---
  app.get('/api/calls', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const calls = zadarmaService.listCalls();
    return res.json(calls);
  });

  // --- Zadarma incoming call webhook and call management ---
  app.post('/api/calls/incoming', (req, res) => {
    try {
      const params = req.body;
      const signature = params.signature || req.headers['x-zadarma-signature'] || '';
      
      // Verify Zadarma webhook signature for security
      if (!zadarmaService.verifySignature(params, signature as string)) {
        console.warn('Invalid Zadarma webhook signature');
        return res.status(403).json({ message: 'Invalid signature' });
      }

      const callData = zadarmaService.handleIncomingCall(params);
      broadcast({ type: 'incoming_call', data: callData });

      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>Your call has been received</Say>\n</Response>`);
    } catch (error) {
      console.error('Error handling incoming call:', error);
      res.status(500).json({ message: 'Error processing call' });
    }
  });

  app.post('/api/calls/:callSid/accept', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    try {
      const { callSid } = req.params;
      const operatorId = req.session.userId;

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
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
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
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
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

  app.post('/api/calls/outgoing', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    try {
      const { phoneNumber, useCallback } = req.body;
      
      let callData;
      if (useCallback) {
        callData = await zadarmaService.initiateOutgoingCall(phoneNumber, req.session.userId);
        if (!callData) {
          return res.status(500).json({ message: 'Failed to initiate call via Zadarma. Check API credentials.' });
        }
      } else {
        callData = zadarmaService.recordOutgoingCall(phoneNumber, req.session.userId);
      }
      
      broadcast({ type: 'outgoing_call', data: callData });
      return res.json({ message: 'Outgoing call initiated', callData });
    } catch (error) {
      console.error('Error initiating outgoing call:', error);
      return res.status(500).json({ message: 'Error initiating call' });
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

  // WebSocket server with session authentication
  const wss = new WebSocketServer({ 
    noServer: true
  });
  
  interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    role?: string;
    masterId?: string;
  }
  
  const clients: AuthenticatedWebSocket[] = [];

  function broadcast(message: any) {
    const text = JSON.stringify(message);
    clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        try { c.send(text); } catch (e) { console.error('WS send error', e); }
      }
    });
  }

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url !== '/ws') {
      socket.destroy();
      return;
    }

    const mockRes = Object.create(ServerResponse.prototype);
    mockRes.writeHead = () => mockRes;
    mockRes.end = () => mockRes;
    
    sessionMiddleware(request as any, mockRes, () => {
      const session = (request as any).session;
      
      if (!session?.userId) {
        console.log('WebSocket connection rejected: No authenticated session');
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      if (session.role !== 'admin' && session.role !== 'operator') {
        console.log(`WebSocket connection rejected: Unauthorized role (${session.role})`);
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        const authWs = ws as AuthenticatedWebSocket;
        authWs.userId = session.userId;
        authWs.role = session.role;
        authWs.masterId = session.masterId;
        wss.emit('connection', authWs, request);
      });
    });
  });

  wss.on('connection', (ws: AuthenticatedWebSocket) => {
    console.log(`WS client connected: user=${ws.userId}, role=${ws.role}`);
    clients.push(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data && data.type === 'identify' && data.role === 'master' && data.masterId) {
          ws.masterId = data.masterId;
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
