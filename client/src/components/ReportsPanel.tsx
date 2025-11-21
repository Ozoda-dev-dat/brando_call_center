import { Calendar, Download, TrendingUp, FileText, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockReports } from '@/data/mockData';

export function ReportsPanel() {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hisobotlar</h1>
          <p className="text-sm text-gray-500 mt-1">Kunlik, haftalik va oylik tahlillar</p>
        </div>
        <Button className="gap-2" data-testid="button-export-report">
          <Download className="w-4 h-4" />
          Eksport Qilish
        </Button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bugun</p>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockReports[0].totalTickets}</p>
            <p className="text-sm text-gray-500 mt-2">buyurtma</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bu Oy</p>
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockReports[1].totalTickets}</p>
            <p className="text-sm text-gray-500 mt-2">buyurtma</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Oylik Daromad</p>
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(mockReports[1].revenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 mt-2">so'm</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bajarilish %</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {Math.round((mockReports[1].completedTickets / mockReports[1].totalTickets) * 100)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">oylik o'rtacha</p>
          </Card>
        </div>

        <div className="grid gap-6">
          {mockReports.map((report) => (
            <Card key={report.id} className="p-6" data-testid={`report-card-${report.id}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.type === 'daily' ? 'Kunlik Hisobot' : report.type === 'weekly' ? 'Haftalik Hisobot' : 'Oylik Hisobot'}
                    </h3>
                    <Badge variant={report.type === 'daily' ? 'default' : 'secondary'}>
                      {new Date(report.date).toLocaleDateString('uz-UZ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {report.type === 'daily' 
                      ? 'Bugungi ish jarayoni va natijalar' 
                      : 'Umumiy ko\'rsatkichlar va tendentsiyalar'}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-download-${report.id}`}>
                  <Download className="w-4 h-4" />
                  Yuklab olish
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6 p-6 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <p className="text-2xl font-bold text-gray-900">{report.totalTickets}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Jami Buyurtmalar</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{report.completedTickets}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Tugatilgan</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <p className="text-2xl font-bold text-gray-900">
                      {(report.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Daromad</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-purple-600" />
                    <p className="text-2xl font-bold text-gray-900">{report.customerSatisfaction.toFixed(1)}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Qoniqish</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">O'rtacha Javob Vaqti</p>
                  <p className="text-xl font-bold text-gray-900">{report.avgResponseTime} daqiqa</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(30 - report.avgResponseTime) / 30 * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">O'rtacha Bajarish Vaqti</p>
                  <p className="text-xl font-bold text-gray-900">{report.avgCompletionTime} daqiqa</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full" 
                      style={{ width: `${(120 - report.avgCompletionTime) / 120 * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4" data-testid={`fraud-alerts-report-${report.id}`}>
                  <p className="text-xs text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Firibgarlik Ogohlantirishlari
                  </p>
                  <p className="text-xl font-bold text-red-700">{report.fraudAlertsCount}</p>
                  <p className="text-xs text-red-600 mt-2">
                    {report.type === 'daily' ? 'Bugungi kun' : 'Bu oyda'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hisobot Turi Tanlang</h3>
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-daily-report">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">Kunlik Hisobot</span>
              <span className="text-xs text-gray-500">Bugungi natijalar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-weekly-report">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="font-semibold">Haftalik Hisobot</span>
              <span className="text-xs text-gray-500">Oxirgi 7 kun</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-monthly-report">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="font-semibold">Oylik Hisobot</span>
              <span className="text-xs text-gray-500">Oxirgi 30 kun</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
