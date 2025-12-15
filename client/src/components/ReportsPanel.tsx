import { Calendar, Download, TrendingUp, FileText, Users, BarChart3, PieChart, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

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

  const ordersByProduct = stats?.orders?.reduce((acc: Record<string, number>, order: any) => {
    const product = order.product || 'Noma\'lum';
    acc[product] = (acc[product] || 0) + 1;
    return acc;
  }, {}) || {};

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
            <h1 className="text-2xl font-bold">Hisobotlar</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">Haqiqiy ma'lumotlar asosida tahlil</p>
        </div>
        <Button className="gap-2 action-button gradient-bg text-white border-0" data-testid="button-export-report">
          <Download className="w-4 h-4" />
          Eksport Qilish
        </Button>
      </div>

      <div className="p-6 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Jami Buyurtmalar</p>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">bazadagi barcha buyurtmalar</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tugatilgan</p>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats?.completedOrders || 0}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-muted-foreground">yetkazilgan buyurtmalar</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Faol Texniklar</p>
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats?.activeMasters || 0}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-muted-foreground">jami texniklar</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Bajarilish %</p>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{completionRate}%</p>
            <p className="text-sm text-muted-foreground mt-2">umumiy bajarilish</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 slide-up">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-500" />
              Holat Bo'yicha Taqsimot
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-sm font-medium">Yangi</span>
                <Badge variant="secondary">{ordersByStatus['new'] || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <span className="text-sm font-medium">Yo'lda</span>
                <Badge className="bg-amber-500">{ordersByStatus['on_way'] || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm font-medium">Jarayonda</span>
                <Badge className="bg-blue-500">{ordersByStatus['in_progress'] || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <span className="text-sm font-medium">Yetkazildi</span>
                <Badge className="bg-green-500">{ordersByStatus['delivered'] || 0}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              Mahsulotlar Bo'yicha
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-auto">
              {Object.entries(ordersByProduct).map(([product, count]) => (
                <div key={product} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-sm font-medium">{product}</span>
                  <Badge variant="outline">{count as number} ta</Badge>
                </div>
              ))}
              {Object.keys(ordersByProduct).length === 0 && (
                <p className="text-center text-muted-foreground py-4">Ma'lumot topilmadi</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 mt-6 slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Barcha Buyurtmalar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mijoz</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Telefon</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Holat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                </tr>
              </thead>
              <tbody>
                {stats?.orders?.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">#{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.clientName}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.clientPhone}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'on_way' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
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
