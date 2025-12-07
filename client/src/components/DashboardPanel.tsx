import { TrendingUp, Users, FileText, DollarSign, Star, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockReports, mockMasters, mockTickets, mockFraudAlerts } from '@/data/mockData';
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
  Legend
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

export function DashboardPanel() {
  const latestReport = mockReports[0];
  const totalActiveMasters = mockMasters.filter(m => m.status === 'active' || m.status === 'busy').length;
  const avgHonestyScore = Math.round(mockMasters.reduce((acc, m) => acc + m.honestyScore, 0) / mockMasters.length);

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Boshqaruv Paneli</h1>
        <p className="text-sm text-gray-500 mt-1">Umumiy ko'rsatkichlar va tahlil</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bugungi Buyurtmalar</p>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="metric-total-tickets">
              {latestReport.totalTickets}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-gray-500">oldingi kunga nisbatan</span>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tugatilgan</p>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="metric-completed-tickets">
              {latestReport.completedTickets}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round((latestReport.completedTickets / latestReport.totalTickets) * 100)}% bajarilish darajasi
            </p>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bugungi Daromad</p>
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="metric-revenue">
              {(latestReport.revenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {latestReport.revenue.toLocaleString('uz-UZ')} so'm
            </p>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Mijoz Qoniqishi</p>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900" data-testid="metric-satisfaction">
              {latestReport.customerSatisfaction.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-2">5 dan</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalik Buyurtmalar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="tickets" fill="#3b82f6" name="Buyurtmalar" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Tugatilgan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalik Daromad (ming so'm)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Daromad"
                  dot={{ fill: '#f59e0b', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usta Ko'rsatkichlari</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Jami ustalar</span>
                <span className="text-2xl font-bold text-gray-900">{mockMasters.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Faol ustalar</span>
                <span className="text-2xl font-bold text-green-600">{totalActiveMasters}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">O'rtacha haliqlik</span>
                <span className="text-2xl font-bold text-blue-600">{avgHonestyScore}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaqt Ko'rsatkichlari</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">O'rtacha javob vaqti</span>
                  <span className="font-medium text-gray-900">{latestReport.avgResponseTime} daq</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${(30 - latestReport.avgResponseTime) / 30 * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">O'rtacha bajarish vaqti</span>
                  <span className="font-medium text-gray-900">{latestReport.avgCompletionTime} daq</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full" 
                    style={{ width: `${(120 - latestReport.avgCompletionTime) / 120 * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-red-50 border-2 border-red-500" data-testid="card-critical-alerts">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Diqqat Talab Etadi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Firibgarlik ogohlantirishlari</span>
                <span className="text-2xl font-bold text-red-700">{mockFraudAlerts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">SLA buzilishlari</span>
                <span className="text-2xl font-bold text-red-700">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Hal qilinmagan muammolar</span>
                <span className="text-2xl font-bold text-red-700">2</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
