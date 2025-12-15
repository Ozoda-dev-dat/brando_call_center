import { Construction, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ServiceCentersPage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted/30 overflow-auto">
      <div className="page-header">
        <h1 className="page-title text-2xl font-bold">Xizmat Markazlari</h1>
        <p className="text-sm text-muted-foreground mt-1">Xizmat markazlari ro'yxati</p>
      </div>

      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="p-12 text-center max-w-md slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Construction className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Texnik ishlar olib borilmoqda</h2>
          <p className="text-muted-foreground mb-6">
            Ushbu bo'lim hozirda yangilanmoqda. Tez orada qaytib keladi.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4 animate-pulse" />
            <span>technical work is underway</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
