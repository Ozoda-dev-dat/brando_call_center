import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import memorystore from "memorystore";
import { seedUsers } from "./seed";

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

  const httpServer = createServer(app);

  return httpServer;
}
