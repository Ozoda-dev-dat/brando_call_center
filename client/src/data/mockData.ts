import type { 
  Ticket, 
  Customer, 
  Master, 
  ServiceCenter, 
  FraudAlert, 
  CallScript,
  Report,
  AdminUser 
} from '@shared/crm-schema';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    number: 'TK-2024-1832',
    customerId: '1',
    customerName: 'Akmal Rahimov',
    customerPhone: '+998 90 123 45 67',
    customerAddress: 'Yunusobod tumani, Amir Temur ko\'chasi 15',
    deviceType: 'Kir yuvish mashinasi',
    deviceModel: 'Samsung WW80',
    issueDescription: 'Suv oqib turibdi, aylanmayapti',
    status: 'on_the_way',
    masterId: 'MS-042',
    masterName: 'Jasur Toshmatov',
    createdAt: new Date('2024-11-21T09:30:00'),
    scheduledTime: new Date('2024-11-21T14:00:00'),
    warrantyStatus: 'out_of_warranty',
    estimatedCost: 250000,
    distance: 8.5,
    gpsLocation: { lat: 41.311151, lng: 69.279737 }
  },
  {
    id: '2',
    number: 'TK-2024-1833',
    customerId: '2',
    customerName: 'Dilnoza Karimova',
    customerPhone: '+998 91 234 56 78',
    customerAddress: 'Chilonzor tumani, Bunyodkor ko\'chasi 42',
    deviceType: 'Muzlatgich',
    deviceModel: 'LG GR-B459',
    issueDescription: 'Sovutmayapti, shovqin chiqarayapti',
    status: 'master_assigned',
    masterId: 'MS-038',
    masterName: 'Bobur Alimov',
    createdAt: new Date('2024-11-21T10:15:00'),
    scheduledTime: new Date('2024-11-21T15:30:00'),
    warrantyStatus: 'in_warranty',
    distance: 12.3
  },
  {
    id: '3',
    number: 'TK-2024-1834',
    customerId: '3',
    customerName: 'Sardor Usmonov',
    customerPhone: '+998 93 345 67 89',
    customerAddress: 'Sergeli tumani, Yangi Sergeli MFY',
    deviceType: 'Konditsioner',
    deviceModel: 'Artel ART-24HR',
    issueDescription: 'Issiq havo chiqaryapti',
    status: 'created',
    createdAt: new Date('2024-11-21T11:00:00'),
    warrantyStatus: 'out_of_warranty',
    estimatedCost: 180000
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Akmal Rahimov',
    phone: '+998 90 123 45 67',
    email: 'akmal.r@gmail.com',
    address: 'Yunusobod tumani, Amir Temur ko\'chasi 15',
    district: 'Yunusobod',
    totalTickets: 8,
    activeTickets: 1,
    lastServiceDate: new Date('2024-10-15'),
    customerSince: new Date('2023-05-12')
  },
  {
    id: '2',
    name: 'Dilnoza Karimova',
    phone: '+998 91 234 56 78',
    email: 'dilnoza.k@mail.ru',
    address: 'Chilonzor tumani, Bunyodkor ko\'chasi 42',
    district: 'Chilonzor',
    totalTickets: 3,
    activeTickets: 1,
    lastServiceDate: new Date('2024-09-20'),
    customerSince: new Date('2024-02-08')
  },
  {
    id: '3',
    name: 'Sardor Usmonov',
    phone: '+998 93 345 67 89',
    address: 'Sergeli tumani, Yangi Sergeli MFY',
    district: 'Sergeli',
    totalTickets: 1,
    activeTickets: 1,
    customerSince: new Date('2024-11-21')
  }
];

export const mockMasters: Master[] = [
  {
    id: 'MS-042',
    code: 'MS-042',
    name: 'Jasur Toshmatov',
    phone: '+998 94 567 89 01',
    status: 'busy',
    rating: 4.8,
    completedJobs: 156,
    activeJobs: 2,
    honestyScore: 92,
    penaltyPoints: 3,
    specializations: ['Kir yuvish mashinasi', 'Konditsioner'],
    district: 'Yunusobod',
    joinedDate: new Date('2023-03-15'),
    lastActive: new Date(),
    fraudAlerts: 1,
    avgResponseTime: 18,
    avgCompletionTime: 65
  },
  {
    id: 'MS-038',
    code: 'MS-038',
    name: 'Bobur Alimov',
    phone: '+998 95 678 90 12',
    status: 'active',
    rating: 4.9,
    completedJobs: 203,
    activeJobs: 1,
    honestyScore: 98,
    penaltyPoints: 0,
    specializations: ['Muzlatgich', 'Kir yuvish mashinasi'],
    district: 'Chilonzor',
    joinedDate: new Date('2022-11-10'),
    lastActive: new Date(),
    fraudAlerts: 0,
    avgResponseTime: 15,
    avgCompletionTime: 58
  },
  {
    id: 'MS-051',
    code: 'MS-051',
    name: 'Kamol Ergashev',
    phone: '+998 97 789 01 23',
    status: 'active',
    rating: 4.6,
    completedJobs: 89,
    activeJobs: 0,
    honestyScore: 85,
    penaltyPoints: 8,
    specializations: ['Konditsioner', 'Plita'],
    district: 'Sergeli',
    joinedDate: new Date('2024-01-20'),
    lastActive: new Date(Date.now() - 30 * 60000),
    fraudAlerts: 3,
    avgResponseTime: 25,
    avgCompletionTime: 75
  }
];

export const mockServiceCenters: ServiceCenter[] = [
  {
    id: '1',
    name: 'Brando Yunusobod Markaz',
    address: 'Yunusobod tumani, Shota Rustaveli ko\'chasi 12',
    district: 'Yunusobod',
    phone: '+998 71 200 00 01',
    email: 'yunusobod@brando.uz',
    activeMasters: 12,
    coverageArea: ['Yunusobod', 'Mirzo Ulug\'bek', 'Yakkasaroy'],
    workingHours: '08:00 - 20:00',
    manager: 'Aziz Karimov'
  },
  {
    id: '2',
    name: 'Brando Chilonzor Markaz',
    address: 'Chilonzor tumani, Qatortol ko\'chasi 28',
    district: 'Chilonzor',
    phone: '+998 71 200 00 02',
    email: 'chilonzor@brando.uz',
    activeMasters: 15,
    coverageArea: ['Chilonzor', 'Yashnobod', 'Olmazor'],
    workingHours: '08:00 - 20:00',
    manager: 'Nodira Saidova'
  }
];

export const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    ticketId: '1',
    ticketNumber: 'TK-2024-1832',
    masterId: 'MS-042',
    masterName: 'Jasur Toshmatov',
    issue: 'Ish oldidan va keyingi suratlar yo\'q',
    severity: 'critical',
    detectedAt: new Date('2024-11-21T13:45:00'),
    resolved: false,
    details: 'Usta hali suratlarni yuklamadi, ish tugaganiga 2 soat bo\'ldi'
  },
  {
    id: '2',
    ticketId: '2',
    ticketNumber: 'TK-2024-1833',
    masterId: 'MS-051',
    masterName: 'Kamol Ergashev',
    issue: 'Kafolat davrida to\'lov olindi',
    severity: 'critical',
    detectedAt: new Date('2024-11-20T16:30:00'),
    resolved: false,
    details: 'Mijoz kafolatda bo\'lgan qurilma uchun 150,000 so\'m to\'lagan'
  },
  {
    id: '3',
    ticketId: '3',
    ticketNumber: 'TK-2024-1827',
    masterId: 'MS-051',
    masterName: 'Kamol Ergashev',
    issue: 'Manzildan juda uzoqda GPS signal',
    severity: 'high',
    detectedAt: new Date('2024-11-21T11:20:00'),
    resolved: false,
    details: 'GPS ko\'rsatgan manzil mijoz manzilidan 3.5 km uzoqda'
  }
];

export const callScript: CallScript = {
  greeting: 'Assalomu alaykum! Brando xizmat markazidan {operator_nomi}. Sizga qanday yordam bera olaman?',
  steps: [
    'Mijozning ismini va telefon raqamini yozib oling',
    'Manzilni aniq so\'rang (tuman, ko\'cha, uy raqami)',
    'Qurilma turini va modelini aniqlang',
    'Muammo haqida batafsil ma\'lumot oling',
    'Kafolat holatini tekshiring',
    'Usta kelish vaqtini belgilang',
    'Taxminiy narxni ma\'lum qiling',
    'Buyurtma raqamini aytib bering'
  ],
  closingStatement: 'Buyurtmangiz qabul qilindi. Raqami: {ticket_number}. Ustamiz {scheduled_time} da sizga boradi. Rahmat!'
};

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'daily',
    date: new Date('2024-11-21'),
    totalTickets: 48,
    completedTickets: 36,
    avgResponseTime: 22,
    avgCompletionTime: 68,
    fraudAlertsCount: 3,
    revenue: 8750000,
    customerSatisfaction: 4.7
  },
  {
    id: '2',
    type: 'monthly',
    date: new Date('2024-11-01'),
    totalTickets: 1247,
    completedTickets: 1156,
    avgResponseTime: 19,
    avgCompletionTime: 65,
    fraudAlertsCount: 28,
    revenue: 248500000,
    customerSatisfaction: 4.6
  }
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Dilshod Mahmudov',
    role: 'admin',
    email: 'dilshod@brando.uz',
    lastLogin: new Date('2024-11-21T08:00:00'),
    active: true
  },
  {
    id: '2',
    username: 'operator1',
    fullName: 'Nigora Sharipova',
    role: 'operator',
    email: 'nigora@brando.uz',
    lastLogin: new Date('2024-11-21T09:15:00'),
    active: true
  },
  {
    id: '3',
    username: 'supervisor1',
    fullName: 'Ravshan Ibragimov',
    role: 'supervisor',
    email: 'ravshan@brando.uz',
    lastLogin: new Date('2024-11-21T08:30:00'),
    active: true
  }
];
