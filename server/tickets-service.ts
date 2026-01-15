import { storage } from "./storage";
import type { Order, InsertOrder } from "@shared/schema";

export type OrderStatus = 'new' | 'assigned' | 'on_way' | 'arrived' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';

class OrdersService {
  async createOrder(orderData: Partial<InsertOrder>): Promise<Order> {
    const newOrder: InsertOrder = {
      clientName: orderData.clientName || null,
      clientPhone: orderData.clientPhone || null,
      address: orderData.address || null,
      lat: orderData.lat || null,
      lng: orderData.lng || null,
      product: orderData.product || null,
      quantity: orderData.quantity || null,
      masterId: orderData.masterId || null,
      status: orderData.status || 'new',
      warrantyExpired: orderData.warrantyExpired || null,
      barcode: orderData.barcode || null,
      distanceKm: orderData.distanceKm || 0,
      isWarrantyRepair: orderData.isWarrantyRepair || false,
      complexity: orderData.complexity || 'standard',
    };

    return await storage.createOrder(newOrder);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return await storage.getOrder(id);
  }

  async updateStatus(id: number, status: string): Promise<Order | undefined> {
    return await storage.updateOrderStatus(id, status);
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    return await storage.updateOrder(id, updates);
  }

  async list(): Promise<Order[]> {
    return await storage.listOrders();
  }

  async delete(id: number): Promise<void> {
    return await storage.deleteOrder(id);
  }
}

export const ticketsService = new OrdersService();
export const ordersService = ticketsService;
