export type TicketStatus = 'created' | 'master_assigned' | 'accepted_by_master' | 'rejected_by_master' | 'in_progress' | 'completed';

export interface Ticket {
  id: string;
  number: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deviceType?: string;
  deviceModel?: string;
  issueDescription?: string;
  masterId?: string;
  status: TicketStatus;
  createdAt: string;
}

class TicketsService {
  private tickets: Map<string, Ticket> = new Map();

  createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'> & { id?: string }) {
    const id = ticket.id || `t_${Date.now()}`;
    const newTicket: Ticket = {
      id,
      number: ticket.number || id,
      customerName: ticket.customerName,
      customerPhone: ticket.customerPhone,
      customerAddress: ticket.customerAddress,
      deviceType: ticket.deviceType,
      deviceModel: ticket.deviceModel,
      issueDescription: ticket.issueDescription,
      masterId: ticket.masterId,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    this.tickets.set(newTicket.id, newTicket);
    return newTicket;
  }

  getTicket(id: string) {
    return this.tickets.get(id);
  }

  updateStatus(id: string, status: Ticket['status']) {
    const t = this.tickets.get(id);
    if (!t) return undefined;
    t.status = status;
    this.tickets.set(id, t);
    return t;
  }

  list() {
    return Array.from(this.tickets.values());
  }
}

export const ticketsService = new TicketsService();
