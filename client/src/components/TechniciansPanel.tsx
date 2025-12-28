import { useState, useMemo } from 'react';
import { Search, Phone, MapPin, Plus, Edit, Trash2, Eye, Loader2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { getPermissions } from '@/lib/permissions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Master } from '@shared/schema';

const REGIONS = ['Toshkent', 'Tashkent City', 'Andijon', 'Bukhara', 'Fergana', 'Karakalpakstan', 'Kashkadarya', 'Navoi', 'Namangan', 'Samarkand', 'Syrdarya', 'Surkhandarya', 'Khorezm'];

interface TechnicianWithStats extends Master {
  activeOrders?: number;
  completedOrders?: number;
  isOnline?: boolean;
}

type SortBy = 'name' | 'phone' | 'region' | 'status' | 'activeOrders' | 'completedOrders' | 'lastUpdate';

export function TechniciansPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const permissions = user ? getPermissions(user.role) : null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechnicianWithStats | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    telegramId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: technicians = [], isLoading, error, refetch } = useQuery<TechnicianWithStats[]>({
    queryKey: ['/api/masters'],
    queryFn: async () => {
      const res = await fetch('/api/masters', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Fetch stats for each technician
      const withStats = await Promise.all(
        data.map(async (tech: Master) => {
          try {
            const statsRes = await fetch(`/api/masters/${tech.id}/stats`, { credentials: 'include' });
            if (statsRes.ok) {
              const stats = await statsRes.json();
              return { ...tech, ...stats };
            }
          } catch (e) {
            // stats endpoint may not exist
          }
          return {
            ...tech,
            activeOrders: 0,
            completedOrders: 0,
            isOnline: tech.lastLocationUpdate && 
              new Date().getTime() - new Date(tech.lastLocationUpdate).getTime() < 2 * 60 * 60 * 1000
          };
        })
      );
      return withStats;
    },
  });

  const getStatus = (tech: TechnicianWithStats) => {
    if (!tech.lastLocationUpdate) return 'Offline';
    const hoursSinceUpdate = (new Date().getTime() - new Date(tech.lastLocationUpdate).getTime()) / (60 * 60 * 1000);
    return hoursSinceUpdate < 2 ? 'Online' : 'Offline';
  };

  const filteredTechs = useMemo(() => {
    let result = technicians.filter(tech => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tech.name?.toLowerCase().includes(query) ||
        tech.phone?.toLowerCase().includes(query);
      const matchesRegion = !selectedRegion || tech.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    // Sort
    result.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      
      switch (sortBy) {
        case 'name':
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
          break;
        case 'phone':
          aVal = a.phone || '';
          bVal = b.phone || '';
          break;
        case 'region':
          aVal = a.region?.toLowerCase() || '';
          bVal = b.region?.toLowerCase() || '';
          break;
        case 'status':
          aVal = getStatus(a);
          bVal = getStatus(b);
          break;
        case 'activeOrders':
          aVal = a.activeOrders || 0;
          bVal = b.activeOrders || 0;
          break;
        case 'completedOrders':
          aVal = a.completedOrders || 0;
          bVal = b.completedOrders || 0;
          break;
        case 'lastUpdate':
          aVal = a.lastLocationUpdate ? new Date(a.lastLocationUpdate).getTime() : 0;
          bVal = b.lastLocationUpdate ? new Date(b.lastLocationUpdate).getTime() : 0;
          break;
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [technicians, searchQuery, selectedRegion, sortBy, sortAsc]);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Xatolik', description: 'Texnikar ismi talab qilinadi', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/masters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || null,
          region: formData.region || null,
          telegramId: formData.telegramId ? parseInt(formData.telegramId) : null,
        }),
      });

      if (!response.ok) throw new Error('Yaratishda xatolik');
      toast({ title: 'Muvaffaqiyat', description: 'Texnikar yaratildi' });
      setIsCreateOpen(false);
      setFormData({ name: '', phone: '', region: '', telegramId: '' });
      refetch();
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : 'Yaratishda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTech) return;
    if (!formData.name.trim()) {
      toast({ title: 'Xatolik', description: 'Texnikar ismi talab qilinadi', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/masters/${selectedTech.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || null,
          region: formData.region || null,
          telegramId: formData.telegramId ? parseInt(formData.telegramId) : null,
        }),
      });

      if (!response.ok) throw new Error('Yangilashda xatolik');
      toast({ title: 'Muvaffaqiyat', description: 'Texnikar yangilandi' });
      setIsEditOpen(false);
      setSelectedTech(null);
      refetch();
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : 'Yangilashda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Texnikni o'chirishni tasdiqlaysizmi?")) return;

    try {
      const response = await fetch(`/api/masters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error("O'chirishda xatolik");
      toast({ title: 'Muvaffaqiyat', description: "Texnikar o'chirildi" });
      refetch();
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : "O'chirishda xatolik", variant: 'destructive' });
    }
  };

  const SortButton = ({ field, label }: { field: SortBy; label: string }) => (
    <button
      onClick={() => {
        if (sortBy === field) {
          setSortAsc(!sortAsc);
        } else {
          setSortBy(field);
          setSortAsc(true);
        }
      }}
      className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
        sortBy === field ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label}
      {sortBy === field && (sortAsc ? ' ↑' : ' ↓')}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 overflow-auto">
      {/* Header */}
      <div className="page-header bg-gradient-to-r from-slate-800 via-slate-700 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Texniklar (Technicians Management)</h1>
            </div>
            <p className="text-sm text-white/80 ml-[60px]">Real-time technician tracking and performance</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="gap-2 action-button bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => refetch()}
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            {permissions?.canManageMasters && (
              <Button 
                className="gap-2 action-button bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => {
                  setFormData({ name: '', phone: '', region: '', telegramId: '' });
                  setIsCreateOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Yangi
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 fade-in">
        {/* Search & Filter */}
        <Card className="p-4 mb-6 shadow-lg border-0">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Qidirish (ism, telefon)..."
                className="pl-10 search-input bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Barcha hududlar</option>
              {REGIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Jami Texniklar', value: technicians.length },
            { label: 'Faol', value: technicians.filter(t => getStatus(t) === 'Online').length },
            { label: 'Jarayonda', value: technicians.filter(t => t.activeOrders && t.activeOrders > 0).length },
            { label: 'Hududlar', value: new Set(technicians.map(t => t.region).filter(Boolean)).size }
          ].map((stat, i) => (
            <Card key={i} className="stat-card shadow-lg border-0 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Table */}
        {filteredTechs.length === 0 ? (
          <Card className="p-12 text-center shadow-lg border-0">
            <p className="text-gray-500 text-lg">Texniklar topilmadi</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left"><SortButton field="name" label="Ism" /></th>
                  <th className="px-6 py-4 text-left"><SortButton field="phone" label="Telefon" /></th>
                  <th className="px-6 py-4 text-left"><SortButton field="region" label="Hudud" /></th>
                  <th className="px-6 py-4 text-center"><SortButton field="status" label="Status" /></th>
                  <th className="px-6 py-4 text-center"><SortButton field="activeOrders" label="Jarayonda" /></th>
                  <th className="px-6 py-4 text-center"><SortButton field="completedOrders" label="Tugatilgan" /></th>
                  <th className="px-6 py-4 text-left"><SortButton field="lastUpdate" label="Oxirgi" /></th>
                  <th className="px-6 py-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechs.map(tech => (
                  <tbody key={tech.id}>
                    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{tech.name || '-'}</td>
                      <td className="px-6 py-4">
                        {tech.phone ? (
                          <a href={`tel:${tech.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {tech.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">{tech.region || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={getStatus(tech) === 'Online' ? 'bg-green-500' : 'bg-gray-500'}>
                          {getStatus(tech)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline">{tech.activeOrders || 0}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium">{tech.completedOrders || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {tech.lastLocationUpdate 
                          ? new Date(tech.lastLocationUpdate).toLocaleDateString('uz-UZ')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          {expandedId === tech.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {permissions?.canManageMasters && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedTech(tech);
                                setFormData({
                                  name: tech.name || '',
                                  phone: tech.phone || '',
                                  region: tech.region || '',
                                  telegramId: tech.telegramId?.toString() || '',
                                });
                                setIsEditOpen(true);
                              }}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(tech.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    {expandedId === tech.id && (
                      <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-bold mb-3">Asosiy Malumot</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">ID:</span> {tech.id}</p>
                                <p><span className="font-medium">Telegram ID:</span> {tech.telegramId || '-'}</p>
                                <p><span className="font-medium">Xizmati:</span> {tech.region || '-'}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold mb-3">Joylashuv</h4>
                              <div className="space-y-2 text-sm">
                                {tech.lastLat && tech.lastLng ? (
                                  <>
                                    <p><span className="font-medium">Lat:</span> {tech.lastLat}</p>
                                    <p><span className="font-medium">Lng:</span> {tech.lastLng}</p>
                                    <p><span className="font-medium">Oxirgi:</span> {tech.lastLocationUpdate ? new Date(tech.lastLocationUpdate).toLocaleString('uz-UZ') : '-'}</p>
                                  </>
                                ) : <p className="text-gray-500">Joylashuv ma'lumoti yo'q</p>}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold mb-3">Statistika</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Jarayonda:</span> {tech.activeOrders || 0}</p>
                                <p><span className="font-medium">Tugatilgan:</span> {tech.completedOrders || 0}</p>
                                <p><span className="font-medium">Status:</span> <Badge className={getStatus(tech) === 'Online' ? 'bg-green-500' : 'bg-gray-500'}>{getStatus(tech)}</Badge></p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yangi Texnikar Qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Texnikar ismi *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ism va familiyasi"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="space-y-2">
              <Label>Hudud</Label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Tanlang</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Telegram ID</Label>
              <Input 
                value={formData.telegramId} 
                onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
                placeholder="Telegram ID raqami"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Bekor</Button>
            <Button onClick={handleCreate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Texnikni Tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Texnikar ismi *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Hudud</Label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Tanlang</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Telegram ID</Label>
              <Input 
                value={formData.telegramId} 
                onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Bekor</Button>
            <Button onClick={handleUpdate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
