import type { Express } from "express";
import { createServer, type Server, ServerResponse } from "http";
import { storage } from "./storage";
import session from "express-session";
import memorystore from "memorystore";
import { seedUsers } from "./seed";
import { WebSocket, WebSocketServer } from "ws";
import { onlinePBXService, type OnlinePBXCallData } from "./onlinepbx-service";
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
  
  app.set('trust proxy', 1);
  
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

  // --- Masters endpoints ---
  app.get('/api/masters', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const mastersList = await storage.listMasters();
      return res.json(mastersList);
    } catch (error: any) {
      console.error('Error listing masters:', error?.message || error);
      return res.status(500).json({ message: 'Error listing masters' });
    }
  });

  app.get('/api/masters/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const master = await storage.getMaster(id);
      if (!master) {
        return res.status(404).json({ message: 'Master not found' });
      }
      return res.json(master);
    } catch (error) {
      console.error('Error getting master', error);
      return res.status(500).json({ message: 'Error getting master' });
    }
  });

  app.post('/api/masters', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create masters' });
    }
    try {
      const master = await storage.createMaster(req.body);
      return res.json(master);
    } catch (error) {
      console.error('Error creating master', error);
      return res.status(500).json({ message: 'Error creating master' });
    }
  });

  app.patch('/api/masters/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update masters' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const master = await storage.updateMaster(id, req.body);
      if (!master) {
        return res.status(404).json({ message: 'Master not found' });
      }
      return res.json(master);
    } catch (error) {
      console.error('Error updating master', error);
      return res.status(500).json({ message: 'Error updating master' });
    }
  });

  app.delete('/api/masters/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete masters' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      await storage.deleteMaster(id);
      return res.json({ message: 'Master deleted' });
    } catch (error) {
      console.error('Error deleting master', error);
      return res.status(500).json({ message: 'Error deleting master' });
    }
  });

  // --- Clients endpoints ---
  app.get('/api/clients', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const clientsList = await storage.listClients();
      return res.json(clientsList);
    } catch (error: any) {
      console.error('Error listing clients:', error?.message || error);
      return res.status(500).json({ message: 'Error listing clients' });
    }
  });

  app.get('/api/clients/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      return res.json(client);
    } catch (error) {
      console.error('Error getting client', error);
      return res.status(500).json({ message: 'Error getting client' });
    }
  });

  app.post('/api/clients', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const client = await storage.createClient(req.body);
      return res.json(client);
    } catch (error) {
      console.error('Error creating client', error);
      return res.status(500).json({ message: 'Error creating client' });
    }
  });

  app.patch('/api/clients/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const client = await storage.updateClient(id, req.body);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      return res.json(client);
    } catch (error) {
      console.error('Error updating client', error);
      return res.status(500).json({ message: 'Error updating client' });
    }
  });

  app.delete('/api/clients/:id', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete clients' });
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      await storage.deleteClient(id);
      return res.json({ message: 'Client deleted' });
    } catch (error) {
      console.error('Error deleting client', error);
      return res.status(500).json({ message: 'Error deleting client' });
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

  // --- List all calls (uses OnlinePBX) ---
  app.get('/api/calls', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const calls = onlinePBXService.listCalls();
    return res.json(calls);
  });

  // --- Outgoing call endpoint (uses OnlinePBX) ---
  app.post('/api/calls/outgoing', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    try {
      const { phoneNumber, sipExtension } = req.body;
      
      if (!onlinePBXService.isConfigured()) {
        return res.status(500).json({ message: 'OnlinePBX not configured. Please set API credentials.' });
      }
      
      const fromExtension = sipExtension || process.env.ONLINEPBX_DEFAULT_SIP;
      
      if (!fromExtension || !/^[\d+]+$/.test(fromExtension)) {
        return res.status(400).json({ message: 'Please enter a valid SIP extension number (digits only)' });
      }
      const result = await onlinePBXService.initiateCall(fromExtension, phoneNumber);
      
      if (!result.success) {
        return res.status(500).json({ message: result.error || 'Failed to initiate call via OnlinePBX' });
      }
      
      broadcast({ type: 'onlinepbx_outgoing_call', data: result.callData });
      return res.json({ message: 'Outgoing call initiated', callData: result.callData });
    } catch (error) {
      console.error('Error initiating outgoing call:', error);
      return res.status(500).json({ message: 'Error initiating call' });
    }
  });

  // --- OnlinePBX Integration ---
  app.get('/api/onlinepbx/status', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.json({
      configured: onlinePBXService.isConfigured(),
      domain: onlinePBXService.getDomain(),
    });
  });

  app.get('/api/onlinepbx/calls', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const calls = onlinePBXService.listCalls();
    return res.json(calls);
  });

  app.get('/api/onlinepbx/history', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    try {
      const { dateFrom, dateTo } = req.query;
      const from = dateFrom ? new Date(dateFrom as string) : undefined;
      const to = dateTo ? new Date(dateTo as string) : undefined;
      
      const history = await onlinePBXService.getCallHistory(from, to);
      return res.json(history);
    } catch (error) {
      console.error('Error getting OnlinePBX call history:', error);
      return res.status(500).json({ message: 'Error getting call history' });
    }
  });

  app.get('/api/onlinepbx/extensions', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    try {
      const extensions = await onlinePBXService.getExtensions();
      return res.json(extensions);
    } catch (error) {
      console.error('Error getting OnlinePBX extensions:', error);
      return res.status(500).json({ message: 'Error getting extensions' });
    }
  });

  app.post('/api/onlinepbx/call', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    try {
      const { from, to } = req.body;
      if (!from || !to) {
        return res.status(400).json({ message: 'from and to are required' });
      }
      
      const callData = await onlinePBXService.initiateCall(from, to);
      if (!callData) {
        return res.status(500).json({ message: 'Failed to initiate call. Check OnlinePBX configuration.' });
      }
      
      broadcast({ type: 'onlinepbx_outgoing_call', data: callData });
      return res.json({ message: 'Call initiated', callData });
    } catch (error) {
      console.error('Error initiating OnlinePBX call:', error);
      return res.status(500).json({ message: 'Error initiating call' });
    }
  });

  app.post('/api/onlinepbx/webhook', (req, res) => {
    try {
      const params = req.body;
      const signature = params.signature || req.headers['x-signature'] || '';
      
      if (!onlinePBXService.verifyWebhookSignature(params, signature as string)) {
        console.warn('Invalid OnlinePBX webhook signature');
        return res.status(403).json({ message: 'Invalid signature' });
      }

      const event = params.event || params.type;
      let callData: OnlinePBXCallData | null = null;
      
      if (event === 'incoming' || event === 'INCOMING') {
        callData = onlinePBXService.handleIncomingCallWebhook(params);
        if (callData) {
          broadcast({ type: 'onlinepbx_incoming_call', data: callData });
        }
      } else {
        callData = onlinePBXService.handleCallStatusWebhook(params);
        if (callData) {
          broadcast({ type: 'onlinepbx_call_status', data: callData });
        }
      }

      return res.json({ status: 'ok' });
    } catch (error) {
      console.error('Error handling OnlinePBX webhook:', error);
      return res.status(500).json({ message: 'Error processing webhook' });
    }
  });

  app.post('/api/onlinepbx/calls/:callId/accept', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { callId } = req.params;
    const callData = onlinePBXService.acceptCall(callId, req.session.userId);
    
    if (callData) {
      broadcast({ type: 'onlinepbx_call_accepted', data: callData });
    }
    
    return res.json({ message: 'Call accepted', callData });
  });

  app.post('/api/onlinepbx/calls/:callId/reject', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { callId } = req.params;
    const callData = onlinePBXService.rejectCall(callId);
    
    if (callData) {
      broadcast({ type: 'onlinepbx_call_rejected', data: callData });
    }
    
    return res.json({ message: 'Call rejected', callData });
  });

  app.post('/api/onlinepbx/calls/:callId/end', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.role !== 'admin' && req.session.role !== 'operator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { callId } = req.params;
    const { duration } = req.body;
    const callData = onlinePBXService.endCall(callId, duration);
    
    if (callData) {
      broadcast({ type: 'onlinepbx_call_ended', data: callData });
    }
    
    return res.json({ message: 'Call ended', callData });
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

    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log(`WS client disconnected: user=${ws.userId}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
