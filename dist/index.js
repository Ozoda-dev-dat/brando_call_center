// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().$type(),
  masterId: text("master_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  masterId: true
});

// server/storage.ts
import { eq } from "drizzle-orm";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool });
var DatabaseStorage = class {
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  async updateUserLastLogin(id) {
    await db.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import session from "express-session";
import memorystore from "memorystore";

// server/seed.ts
import { eq as eq2 } from "drizzle-orm";
var INITIAL_USERS = [
  {
    username: "admin",
    password: "admin2233",
    fullName: "Administrator",
    role: "admin"
  },
  {
    username: "operator",
    password: "callcenter123",
    fullName: "Operator",
    role: "operator"
  },
  {
    username: "master",
    password: "MS123",
    fullName: "Master",
    role: "master",
    masterId: "MS-042"
  }
];
async function seedUsers() {
  try {
    for (const user of INITIAL_USERS) {
      const existing = await db.select().from(users).where(eq2(users.username, user.username)).limit(1);
      if (existing.length === 0) {
        await db.insert(users).values(user);
        console.log(`Created user: ${user.username}`);
      } else {
        console.log(`User already exists: ${user.username}`);
      }
    }
    console.log("User seeding completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

// server/routes.ts
var MemoryStore = memorystore(session);
async function registerRoutes(app2) {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "brando-crm-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3,
      sameSite: "strict"
    },
    store: new MemoryStore({
      checkPeriod: 864e5
    })
  });
  app2.use(sessionMiddleware);
  await seedUsers();
  app2.post("/api/auth/login", async (req, res) => {
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
        masterId: user.masterId || null
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server xatosi" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Chiqishda xatolik" });
      }
      res.json({ message: "Muvaffaqiyatli chiqildi" });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
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
      masterId: user.masterId || null
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: false
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
