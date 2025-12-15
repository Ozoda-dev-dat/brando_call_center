import { TrendingUp, TrendingDown, Users, FileText, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
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
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color: string;
}

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  return (
    <div className="stat-card slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t">
          {trend.positive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-muted-foreground">oldingi kunga nisbatan</span>
        </div>
      )}
    </div>
  );
}

export function DashboardPanel() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    refetchInterval: 30000,
  });

  const ordersByStatus = stats?.orders?.reduce((acc: Record<string, number>, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const chartData = [
    { name: 'Yangi', value: ordersByStatus['new'] || 0, fill: 'hsl(210 30% 50%)' },
    { name: 'Yo\'lda', value: ordersByStatus['on_way'] || 0, fill: 'hsl(45 90% 50%)' },
    { name: 'Jarayonda', value: ordersByStatus['in_progress'] || 0, fill: 'hsl(200 70% 50%)' },
    { name: 'Yetkazildi', value: ordersByStatus['delivered'] || 0, fill: 'hsl(142 71% 45%)' },
  ];

  const completionRate = stats?.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

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
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title text-2xl font-bold">Boshqaruv Paneli</h1>
            <p className="text-sm text-muted-foreground mt-1">Haqiqiy ma'lumotlar asosida</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Jami Buyurtmalar"
            value={stats?.totalOrders || 0}
            subtitle={`${completionRate}% bajarildi`}
            icon={<FileText className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-slate-600 to-slate-700"
          />
          <StatCard
            title="Tugatilgan"
            value={stats?.completedOrders || 0}
            subtitle={`${stats?.inProgressOrders || 0} ta jarayonda`}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Yangi Buyurtmalar"
            value={stats?.newOrders || 0}
            subtitle="Kutilmoqda"
            icon={<Package className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <StatCard
            title="Faol Texniklar"
            value={stats?.activeMasters || 0}
            subtitle="Jami texniklar"
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Buyurtmalar Holati
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" name="Soni" radius={[6, 6, 0, 0]} fill="hsl(25 90% 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              Texniklar Ro'yxati
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-auto">
              {stats?.masters?.map((master: any) => (
                <div key={master.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {master.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <p className="font-medium">{master.name}</p>
                      <p className="text-sm text-muted-foreground">{master.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{master.phone || 'Telegram orqali'}</p>
                  </div>
                </div>
              ))}
              {(!stats?.masters || stats.masters.length === 0) && (
                <p className="text-center text-muted-foreground py-8">Texniklar topilmadi</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            So'nggi Buyurtmalar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mijoz</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Holat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                </tr>
              </thead>
              <tbody>
                {stats?.orders?.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">#{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.clientName}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'on_way' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status === 'delivered' ? 'Yetkazildi' :
                         order.status === 'on_way' ? 'Yo\'lda' :
                         order.status === 'in_progress' ? 'Jarayonda' : 'Yangi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!stats?.orders || stats.orders.length === 0) && (
              <p className="text-center text-muted-foreground py-8">Buyurtmalar topilmadi</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
