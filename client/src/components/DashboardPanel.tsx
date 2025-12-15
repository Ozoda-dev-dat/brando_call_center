import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Star, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockReports, mockMasters, mockFraudAlerts } from '@/data/mockData';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
} from 'recharts';

const weeklyData = [
  { day: 'Dush', tickets: 45, completed: 38, revenue: 8200 },
  { day: 'Sesh', tickets: 52, completed: 44, revenue: 9500 },
  { day: 'Chor', tickets: 48, completed: 42, revenue: 9100 },
  { day: 'Pay', tickets: 55, completed: 48, revenue: 10200 },
  { day: 'Juma', tickets: 62, completed: 54, revenue: 11800 },
  { day: 'Shan', tickets: 38, completed: 35, revenue: 7500 },
  { day: 'Yak', tickets: 48, completed: 41, revenue: 8900 }
];

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
  const latestReport = mockReports[0];
  const totalActiveMasters = mockMasters.filter(m => m.status === 'active' || m.status === 'busy').length;
  const avgHonestyScore = Math.round(mockMasters.reduce((acc, m) => acc + m.honestyScore, 0) / mockMasters.length);
  const completionRate = Math.round((latestReport.completedTickets / latestReport.totalTickets) * 100);

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted/30 overflow-auto">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title text-2xl font-bold">Boshqaruv Paneli</h1>
            <p className="text-sm text-muted-foreground mt-1">Umumiy ko'rsatkichlar va tahlil</p>
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
            title="Bugungi Buyurtmalar"
            value={latestReport.totalTickets}
            subtitle={`${completionRate}% bajarildi`}
            icon={<FileText className="w-6 h-6 text-white" />}
            trend={{ value: 8.2, positive: true }}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Tugatilgan"
            value={latestReport.completedTickets}
            subtitle={`${latestReport.totalTickets - latestReport.completedTickets} ta jarayonda`}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            trend={{ value: 12.5, positive: true }}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Bugungi Daromad"
            value={`${(latestReport.revenue / 1000000).toFixed(1)}M`}
            subtitle={`${latestReport.revenue.toLocaleString('uz-UZ')} so'm`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            trend={{ value: 5.3, positive: true }}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <StatCard
            title="Mijoz Qoniqishi"
            value={latestReport.customerSatisfaction.toFixed(1)}
            subtitle="5 dan o'rtacha ball"
            icon={<Star className="w-6 h-6 text-white" />}
            trend={{ value: 2.1, positive: true }}
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Haftalik Buyurtmalar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="tickets" fill="hsl(217 91% 60%)" name="Buyurtmalar" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(142 71% 45%)" name="Tugatilgan" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              Haftalik Daromad
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(38 92% 50%)" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  name="Daromad (ming so'm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Usta Ko'rsatkichlari
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Jami ustalar</span>
                <span className="text-2xl font-bold">{mockMasters.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                <span className="text-sm text-green-600">Faol ustalar</span>
                <span className="text-2xl font-bold text-green-600">{totalActiveMasters}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                <span className="text-sm text-blue-600">O'rtacha halollik</span>
                <span className="text-2xl font-bold text-blue-600">{avgHonestyScore}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Vaqt Ko'rsatkichlari
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">O'rtacha javob vaqti</span>
                  <span className="font-semibold">{latestReport.avgResponseTime} daq</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: `${(30 - latestReport.avgResponseTime) / 30 * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">O'rtacha bajarish vaqti</span>
                  <span className="font-semibold">{latestReport.avgCompletionTime} daq</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" 
                    style={{ width: `${(120 - latestReport.avgCompletionTime) / 120 * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800 slide-up" style={{ animationDelay: '0.5s' }} data-testid="card-critical-alerts">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Diqqat Talab Etadi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10">
                <span className="text-sm text-red-600 dark:text-red-400">Firibgarlik ogohlantirishlari</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{mockFraudAlerts.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10">
                <span className="text-sm text-orange-600 dark:text-orange-400">SLA buzilishlari</span>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-amber-500/10">
                <span className="text-sm text-amber-600 dark:text-amber-400">Hal qilinmagan</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">2</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
