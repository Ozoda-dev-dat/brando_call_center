import { storage } from "./storage";
import type { Ticket, InsertTicket } from "@shared/schema";

export type TicketStatus = 'created' | 'confirmed' | 'master_assigned' | 'on_the_way' | 'arrived' | 'in_progress' | 'photos_taken' | 'payment_pending' | 'payment_blocked' | 'completed' | 'control_call' | 'closed';

class TicketsService {
  private generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TK-${year}-${random}`;
  }

  async createTicket(ticketData: Partial<InsertTicket>): Promise<Ticket> {
    const number = ticketData.number || this.generateTicketNumber();
    
    const newTicket: InsertTicket = {
      number,
      customerName: ticketData.customerName || 'Unknown',
      customerPhone: ticketData.customerPhone || '',
      customerAddress: ticketData.customerAddress,
      customerId: ticketData.customerId,
      deviceType: ticketData.deviceType,
      deviceModel: ticketData.deviceModel,
      issueDescription: ticketData.issueDescription,
      masterId: ticketData.masterId,
      masterName: ticketData.masterName,
      status: ticketData.status || 'created',
      scheduledTime: ticketData.scheduledTime,
      warrantyStatus: ticketData.warrantyStatus || 'out_of_warranty',
      estimatedCost: ticketData.estimatedCost,
      distance: ticketData.distance,
      gpsLocation: ticketData.gpsLocation,
    };

    return await storage.createTicket(newTicket);
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return await storage.getTicket(id);
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket | undefined> {
    return await storage.updateTicketStatus(id, status);
  }

  async updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined> {
    return await storage.updateTicket(id, updates);
  }

  async list(): Promise<Ticket[]> {
    return await storage.listTickets();
  }

  async delete(id: string): Promise<void> {
    return await storage.deleteTicket(id);
  }
}

export const ticketsService = new TicketsService();
