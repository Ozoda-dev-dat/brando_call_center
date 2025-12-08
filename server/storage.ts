import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { users, tickets, type User, type InsertUser, type Ticket, type InsertTicket } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketByNumber(number: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined>;
  updateTicketStatus(id: string, status: string): Promise<Ticket | undefined>;
  listTickets(): Promise<Ticket[]>;
  deleteTicket(id: string): Promise<void>;
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

  async getTicket(id: string): Promise<Ticket | undefined> {
    const result = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
    return result[0];
  }

  async getTicketByNumber(number: string): Promise<Ticket | undefined> {
    const result = await db.select().from(tickets).where(eq(tickets.number, number)).limit(1);
    return result[0];
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const result = await db.insert(tickets).values(insertTicket as any).returning();
    return result[0];
  }

  async updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const result = await db.update(tickets).set(updates as any).where(eq(tickets.id, id)).returning();
    return result[0];
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const result = await db.update(tickets).set({ status: status as any }).where(eq(tickets.id, id)).returning();
    return result[0];
  }

  async listTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async deleteTicket(id: string): Promise<void> {
    await db.delete(tickets).where(eq(tickets.id, id));
  }
}

export const storage = new DatabaseStorage();
