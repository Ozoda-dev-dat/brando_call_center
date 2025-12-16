import { Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ServiceCentersPanel() {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Xizmat Markazlari</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Filiallar va qamrov hududlari</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
        <Card className="p-12 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Texnik ishlar olib borilmoqda
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Xizmat markazlari bo'limi hozirda ishlab chiqilmoqda. Tez orada yangi imkoniyatlar qo'shiladi.
          </p>
        </Card>
      </div>
    </div>
  );
}
