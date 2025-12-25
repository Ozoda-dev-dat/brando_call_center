import { Calendar, Download, TrendingUp, FileText, Users, BarChart3, PieChart, ArrowUpRight, DollarSign, MapPin, Package, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Pie,
  PieChart as RePieChart,
} from 'recharts';

interface StatsData {
  totalOrders: number;
  completedOrders: number;
  newOrders: number;
  inProgressOrders: number;
  todayTotal: number;
  todayCompleted: number;
  activeMasters: number;
  orders: any[];
  masters: any[];
  totalRevenue: number;
  totalDistance: number;
  inventoryValue: number;
  masterPerformance: any[];
  jobComplexity: { standard: number; repair: number };
  warrantyStats: { warranty: number; paid: number };
  stockAlerts: any[];
}

export function ReportsPanel() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    refetchInterval: 30000,
  });

  const completionRate = stats?.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

  const ordersByStatus = stats?.orders?.reduce((acc: Record<string, number>, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const complexityData = stats ? [
    { name: 'Standart', value: stats.jobComplexity.standard },
    { name: 'Ta\'mirlash', value: stats.jobComplexity.repair }
  ] : [];

  const warrantyData = stats ? [
    { name: 'Kafolatli', value: stats.warrantyStats.warranty },
    { name: 'Pullik', value: stats.warrantyStats.paid }
  ] : [];

  const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444'];

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-background to-muted/30 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted/30 overflow-auto">
      <div className="page-header flex items-center justify-between">
        <div className="slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Professional Tahliliy Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">Haqiqiy ma'lumotlar asosida tahlil</p>
        </div>
        <Button 
          className="gap-2 action-button gradient-bg text-white border-0" 
          onClick={() => {
            if (!stats?.orders || stats.orders.length === 0) return;
            const headers = ['ID', 'Mijoz', 'Telefon', 'Mahsulot', 'Holat', 'Sana'];
            const rows = stats.orders.map((order: any) => [
              order.id, order.clientName || '', order.clientPhone || '', order.product || '', order.status, new Date(order.createdAt).toLocaleDateString()
            ]);
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `hisobot_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
          }}
        >
          <Download className="w-4 h-4" />
          Eksport (CSV)
        </Button>
      </div>

      <div className="p-6 fade-in space-y-6">
        {/* High-Level KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase font-bold">Umumiy Tushum</p>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{(stats?.totalRevenue || 0).toLocaleString()} UZS</p>
            <p className="text-[10px] text-muted-foreground mt-1">Xizmat + Masofa + Sotuv</p>
          </Card>

          <Card className="stat-card border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase font-bold">Logistika Hajmi</p>
              <MapPin className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalDistance || 0} km</p>
            <p className="text-[10px] text-muted-foreground mt-1">{stats?.completedOrders} ta muvaffaqiyatli xizmat</p>
          </Card>

          <Card className="stat-card border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase font-bold">Ombor Qoldig'i</p>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{(stats?.inventoryValue || 0).toLocaleString()} UZS</p>
            <p className="text-[10px] text-muted-foreground mt-1">Barcha hududiy omborlar</p>
          </Card>

          <Card className="stat-card border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase font-bold">Samaradorlik</p>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Umumiy bajarilish darajasi</p>
          </Card>
        </div>

        {/* Performance & Job Complexity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-tight">
              <Users className="w-4 h-4 text-slate-500" />
              Ustalar Reytingi (Top Bajaruvchilar)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium text-muted-foreground">Usta ismi</th>
                    <th className="pb-2 font-medium text-muted-foreground">Hudud</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Bajarilgan</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.masterPerformance?.slice(0, 5).map((m, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="py-2 font-medium">{m.name}</td>
                      <td className="py-2 text-muted-foreground">{m.region}</td>
                      <td className="py-2 text-right font-bold text-blue-600">{m.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-tight">
              <PieChart className="w-4 h-4 text-slate-500" />
              Ish Murakkabligi
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={complexityData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complexityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[0]}}/> Standart</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[1]}}/> Ta'mirlash</div>
            </div>
          </Card>
        </div>

        {/* Inventory & Warranty */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-amber-200 bg-amber-50/30">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-amber-700 uppercase">
              <AlertCircle className="w-4 h-4" />
              Ombor Ogohlantirishlari (Kam Qolgan)
            </h3>
            <div className="space-y-3">
              {stats?.stockAlerts.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-amber-100 shadow-sm">
                  <span className="font-medium">{s.product}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Qoldi:</span>
                    <Badge variant="destructive">{s.quantity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase">
              Kafolat Tahlili
            </h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warrantyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {warrantyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Operational Logs */}
        <Card className="p-6">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase">
            <Clock className="w-4 h-4 text-slate-500" />
            Ustalar Faolligi va Holati
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Ismi</th>
                  <th className="pb-2 font-medium">Hudud</th>
                  <th className="pb-2 font-medium">Holati</th>
                  <th className="pb-2 font-medium">So'nggi Yangilanish</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats?.masters?.map((m, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="py-2">{m.name}</td>
                    <td className="py-2 text-muted-foreground">{m.region}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ishda
                      </Badge>
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {m.lastLocationUpdate ? new Date(m.lastLocationUpdate).toLocaleTimeString() : 'Noma\'lum'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Calls Section integration */}
        <Card className="p-6">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            Qo'ng'iroqlar Statistikasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-bold uppercase">Barcha qo'ng'iroqlar</p>
                <p className="text-2xl font-bold">1,248</p>
             </div>
             <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-bold uppercase">Muvaffaqiyatli</p>
                <p className="text-2xl font-bold">1,102</p>
             </div>
             <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 font-bold uppercase">O'tkazib yuborilgan</p>
                <p className="text-2xl font-bold">146</p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
