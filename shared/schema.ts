import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().$type<'admin' | 'operator' | 'master'>(),
  masterId: text("master_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  masterId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull().unique(),
  customerId: text("customer_id"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  deviceType: text("device_type"),
  deviceModel: text("device_model"),
  issueDescription: text("issue_description"),
  status: text("status").notNull().$type<'created' | 'confirmed' | 'master_assigned' | 'on_the_way' | 'arrived' | 'in_progress' | 'photos_taken' | 'payment_pending' | 'payment_blocked' | 'completed' | 'control_call' | 'closed'>().default('created'),
  masterId: text("master_id"),
  masterName: text("master_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  scheduledTime: timestamp("scheduled_time"),
  completedAt: timestamp("completed_at"),
  warrantyStatus: text("warranty_status").$type<'in_warranty' | 'out_of_warranty'>().default('out_of_warranty'),
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  distance: real("distance"),
  photosBefore: jsonb("photos_before").$type<string[]>(),
  photosAfter: jsonb("photos_after").$type<string[]>(),
  gpsLocation: jsonb("gps_location").$type<{ lat: number; lng: number }>(),
  signature: text("signature"),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
