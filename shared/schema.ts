import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, serial, doublePrecision, boolean, bigint } from "drizzle-orm/pg-core";
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

export const masters = pgTable("masters", {
  id: serial("id").primaryKey(),
  name: text("name"),
  phone: text("phone"),
  telegramId: bigint("telegram_id", { mode: "number" }),
  region: text("region"),
  lastLat: text("last_lat"),
  lastLng: text("last_lng"),
  lastLocationUpdate: timestamp("last_location_update", { withTimezone: true }),
  serviceCenterId: integer("service_center_id"),
});

export const insertMasterSchema = createInsertSchema(masters).omit({
  id: true,
});

export type InsertMaster = z.infer<typeof insertMasterSchema>;
export type Master = typeof masters.$inferSelect;

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name"),
  phone: text("phone"),
  address: text("address"),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  managerName: text("manager_name"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  warehouseId: integer("warehouse_id").references(() => warehouses.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  unitPrice: doublePrecision("unit_price").notNull().default(0),
});

export const serviceFees = pgTable("service_fees", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productPrice: doublePrecision("product_price").default(0),
  distanceFee: doublePrecision("distance_fee").default(0),
  serviceFee: doublePrecision("service_fee").default(0),
  totalEarnings: doublePrecision("total_earnings").default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  masterId: integer("master_id"),
  clientName: text("client_name"),
  clientPhone: text("client_phone"),
  address: text("address"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  product: text("product"),
  quantity: integer("quantity"),
  status: text("status").default('new'),
  beforePhoto: text("before_photo"),
  afterPhoto: text("after_photo"),
  signature: text("signature"),
  createdAt: timestamp("created_at").defaultNow(),
  masterCurrentLat: doublePrecision("master_current_lat"),
  masterCurrentLng: doublePrecision("master_current_lng"),
  warrantyExpired: boolean("warranty_expired"),
  sparePartSent: boolean("spare_part_sent").default(false),
  sparePartReceived: boolean("spare_part_received").default(false),
  sparePartPhoto: text("spare_part_photo"),
  completionGpsLat: doublePrecision("completion_gps_lat"),
  completionGpsLng: doublePrecision("completion_gps_lng"),
  masterTelegramId: bigint("master_telegram_id", { mode: "number" }),
  barcode: text("barcode"),
  distanceKm: doublePrecision("distance_km").default(0),
  isWarrantyRepair: boolean("is_warranty_repair").default(false),
  complexity: text("complexity").default('standard'), // 'standard' or 'repair'
});

export const insertWarehouseSchema = createInsertSchema(warehouses).omit({ id: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertServiceFeeSchema = createInsertSchema(serviceFees).omit({ id: true });

export type Warehouse = typeof warehouses.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type ServiceFee = typeof serviceFees.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const tickets = orders;
export type Ticket = Order;
export type InsertTicket = InsertOrder;
export const insertTicketSchema = insertOrderSchema;

export const serviceCenters = pgTable("service_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceCenterSchema = createInsertSchema(serviceCenters).omit({
  id: true,
  createdAt: true,
});

export type ServiceCenter = typeof serviceCenters.$inferSelect;
export type InsertServiceCenter = z.infer<typeof insertServiceCenterSchema>;
