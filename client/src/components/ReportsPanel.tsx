import { Calendar, Download, TrendingUp, FileText, DollarSign, Users, AlertTriangle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockReports } from '@/data/mockData';

export function ReportsPanel() {
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-purple-50/30 overflow-auto">
      <div className="page-header flex items-center justify-between">
        <div className="slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hisobotlar</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">Kunlik, haftalik va oylik tahlillar</p>
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
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bugun</p>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockReports[0].totalTickets}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500">kechagiga nisbatan</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bu Oy</p>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{mockReports[1].totalTickets}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500">o'tgan oyga</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Oylik Daromad</p>
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(mockReports[1].revenue / 1000000).toFixed(1)}M
            </p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+15%</span>
              <span className="text-sm text-gray-500">so'm</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bajarilish %</p>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              {Math.round((mockReports[1].completedTickets / mockReports[1].totalTickets) * 100)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">oylik o'rtacha</p>
          </Card>
        </div>

        <div className="grid gap-6">
          {mockReports.map((report, index) => (
            <Card 
              key={report.id} 
              className="p-6 glass-card border-0 shadow-lg overflow-hidden list-item" 
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`report-card-${report.id}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.type === 'daily' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : report.type === 'weekly'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  }`}>
                    {report.type === 'daily' ? (
                      <Calendar className="w-6 h-6 text-white" />
                    ) : report.type === 'weekly' ? (
                      <BarChart3 className="w-6 h-6 text-white" />
                    ) : (
                      <PieChart className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {report.type === 'daily' ? 'Kunlik Hisobot' : report.type === 'weekly' ? 'Haftalik Hisobot' : 'Oylik Hisobot'}
                      </h3>
                      <Badge className={`border-0 ${
                        report.type === 'daily'
                          ? 'bg-blue-100 text-blue-700'
                          : report.type === 'weekly'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {new Date(report.date).toLocaleDateString('uz-UZ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {report.type === 'daily' 
                        ? 'Bugungi ish jarayoni va natijalar' 
                        : 'Umumiy ko\'rsatkichlar va tendentsiyalar'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 action-button hover:bg-blue-50 hover:border-blue-300" data-testid={`button-download-${report.id}`}>
                  <Download className="w-4 h-4" />
                  Yuklab olish
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4 p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl mb-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{report.totalTickets}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Jami Buyurtmalar</p>
                </div>

                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{report.completedTickets}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Tugatilgan</p>
                </div>

                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(report.revenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Daromad</p>
                </div>

                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{report.customerSatisfaction.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Qoniqish</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">O'rtacha Javob Vaqti</p>
                  <p className="text-2xl font-bold text-gray-900">{report.avgResponseTime} <span className="text-sm font-normal text-gray-500">daqiqa</span></p>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                      style={{ width: `${(30 - report.avgResponseTime) / 30 * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">O'rtacha Bajarish Vaqti</p>
                  <p className="text-2xl font-bold text-gray-900">{report.avgCompletionTime} <span className="text-sm font-normal text-gray-500">daqiqa</span></p>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${(120 - report.avgCompletionTime) / 120 * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 shadow-sm" data-testid={`fraud-alerts-report-${report.id}`}>
                  <p className="text-xs text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    Firibgarlik Ogohlantirishlari
                  </p>
                  <p className="text-2xl font-bold text-red-700">{report.fraudAlertsCount}</p>
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    {report.type === 'daily' ? 'Bugungi kun' : 'Bu oyda'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6 glass-card border-0 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Hisobot Turi Tanlang
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-6 flex-col gap-3 action-button hover:bg-blue-50 hover:border-blue-300 group" data-testid="button-daily-report">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900">Kunlik Hisobot</span>
              <span className="text-xs text-gray-500">Bugungi natijalar</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-3 action-button hover:bg-green-50 hover:border-green-300 group" data-testid="button-weekly-report">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <span className="font-bold text-gray-900">Haftalik Hisobot</span>
              <span className="text-xs text-gray-500">Oxirgi 7 kun</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-3 action-button hover:bg-purple-50 hover:border-purple-300 group" data-testid="button-monthly-report">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <PieChart className="w-7 h-7 text-purple-600" />
              </div>
              <span className="font-bold text-gray-900">Oylik Hisobot</span>
              <span className="text-xs text-gray-500">Oxirgi 30 kun</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
