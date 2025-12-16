import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { users, orders, masters, clients, type User, type InsertUser, type Order, type InsertOrder, type Master, type InsertMaster, type Client, type InsertClient } from "@shared/schema";
import { eq, desc, sql, or, ilike } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  listOrders(): Promise<Order[]>;
  deleteOrder(id: number): Promise<void>;

  listMasters(): Promise<Master[]>;
  getMaster(id: number): Promise<Master | undefined>;
  getMasterByName(name: string): Promise<Master | undefined>;
  createMaster(master: InsertMaster): Promise<Master>;
  updateMaster(id: number, updates: Partial<InsertMaster>): Promise<Master | undefined>;
  deleteMaster(id: number): Promise<void>;

  listClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser as any).returning();
    return result[0];
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder as any).returning();
    return result[0];
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(orders).set(updates as any).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status: status as any }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async listOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async deleteOrder(id: number): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  async listMasters(): Promise<Master[]> {
    return await db.select().from(masters);
  }

  async getMaster(id: number): Promise<Master | undefined> {
    const result = await db.select().from(masters).where(eq(masters.id, id)).limit(1);
    return result[0];
  }

  async createMaster(insertMaster: InsertMaster): Promise<Master> {
    const result = await db.insert(masters).values(insertMaster as any).returning();
    return result[0];
  }

  async updateMaster(id: number, updates: Partial<InsertMaster>): Promise<Master | undefined> {
    const result = await db.update(masters).set(updates as any).where(eq(masters.id, id)).returning();
    return result[0];
  }

  async deleteMaster(id: number): Promise<void> {
    await db.delete(masters).where(eq(masters.id, id));
  }

  async listClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(insertClient as any).returning();
    return result[0];
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients).set(updates as any).where(eq(clients.id, id)).returning();
    return result[0];
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getMasterByName(name: string): Promise<Master | undefined> {
    const result = await db.select().from(masters).where(ilike(masters.name, name)).limit(1);
    return result[0];
  }

  async getCustomersFromOrders(search: string = ''): Promise<{ name: string | null; phone: string | null }[]> {
    const baseQuery = db
      .selectDistinct({
        name: orders.clientName,
        phone: orders.clientPhone,
      })
      .from(orders);

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      return await baseQuery.where(
        or(
          ilike(orders.clientName, searchPattern),
          ilike(orders.clientPhone, searchPattern)
        )
      );
    }

    return await baseQuery;
  }
}

export const storage = new DatabaseStorage();
