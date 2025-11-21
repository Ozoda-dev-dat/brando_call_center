export type TicketStatus = 
  | 'created' 
  | 'confirmed' 
  | 'master_assigned' 
  | 'on_the_way' 
  | 'arrived' 
  | 'in_progress' 
  | 'photos_taken' 
  | 'payment_pending' 
  | 'payment_blocked'
  | 'completed' 
  | 'control_call'
  | 'closed';

export type MasterStatus = 'active' | 'busy' | 'offline' | 'suspended';

export type FraudSeverity = 'critical' | 'high' | 'medium';

export interface Ticket {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deviceType: string;
  deviceModel: string;
  issueDescription: string;
  status: TicketStatus;
  masterId?: string;
  masterName?: string;
  createdAt: Date;
  scheduledTime?: Date;
  completedAt?: Date;
  warrantyStatus: 'in_warranty' | 'out_of_warranty';
  estimatedCost?: number;
  actualCost?: number;
  distance?: number;
  photosBefore?: string[];
  photosAfter?: string[];
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  signature?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  totalTickets: number;
  activeTickets: number;
  lastServiceDate?: Date;
  customerSince: Date;
  notes?: string;
}

export interface Master {
  id: string;
  code: string;
  name: string;
  phone: string;
  status: MasterStatus;
  rating: number;
  completedJobs: number;
  activeJobs: number;
  honestyScore: number;
  penaltyPoints: number;
  specializations: string[];
  district: string;
  joinedDate: Date;
  lastActive?: Date;
  fraudAlerts: number;
  avgResponseTime: number;
  avgCompletionTime: number;
}

export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  activeMasters: number;
  coverageArea: string[];
  workingHours: string;
  manager: string;
}

export interface FraudAlert {
  id: string;
  ticketId: string;
  ticketNumber: string;
  masterId: string;
  masterName: string;
  issue: string;
  severity: FraudSeverity;
  detectedAt: Date;
  resolved: boolean;
  details?: string;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface CallScript {
  greeting: string;
  steps: string[];
  closingStatement: string;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  date: Date;
  totalTickets: number;
  completedTickets: number;
  avgResponseTime: number;
  avgCompletionTime: number;
  fraudAlertsCount: number;
  revenue: number;
  customerSatisfaction: number;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'operator' | 'supervisor';
  email: string;
  lastLogin?: Date;
  active: boolean;
}
