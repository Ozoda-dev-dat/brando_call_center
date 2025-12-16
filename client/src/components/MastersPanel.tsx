import { useState } from 'react';
import { Search, UserCheck, Phone, MapPin, Star, Briefcase, Plus, Edit, Trash2, Eye, Loader2, X } from 'lucide-react';
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

export function MastersPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const permissions = user ? getPermissions(user.role) : null;
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    telegramId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: masters = [], isLoading, error } = useQuery<Master[]>({
    queryKey: ['/api/masters'],
    queryFn: async () => {
      const res = await fetch('/api/masters', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch masters');
      return res.json();
    },
  });

  const handleCreate = async () => {
    if (!formData.name) {
      toast({ title: 'Xatolik', description: 'Usta ismi majburiy', variant: 'destructive' });
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
          phone: formData.phone,
          region: formData.region,
          telegramId: formData.telegramId ? parseInt(formData.telegramId) : null,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create');
      }
      
      toast({ title: 'Muvaffaqiyat', description: 'Usta yaratildi' });
      setIsCreateOpen(false);
      setFormData({ name: '', phone: '', region: '', telegramId: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : 'Yaratishda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMaster) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/masters/${selectedMaster.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          region: formData.region,
          telegramId: formData.telegramId ? parseInt(formData.telegramId) : null,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update');
      }
      
      toast({ title: 'Muvaffaqiyat', description: 'Usta yangilandi' });
      setIsEditOpen(false);
      setSelectedMaster(null);
      queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : 'Yangilashda xatolik', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ustani o'chirishni tasdiqlaysizmi?")) return;

    try {
      const response = await fetch(`/api/masters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete');
      }
      
      toast({ title: 'Muvaffaqiyat', description: "Usta o'chirildi" });
      queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
    } catch (err) {
      toast({ title: 'Xatolik', description: err instanceof Error ? err.message : "O'chirishda xatolik", variant: 'destructive' });
    }
  };

  const openEditDialog = (master: Master) => {
    setSelectedMaster(master);
    setFormData({
      name: master.name || '',
      phone: master.phone || '',
      region: master.region || '',
      telegramId: master.telegramId?.toString() || '',
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (master: Master) => {
    setSelectedMaster(master);
    setIsViewOpen(true);
  };

  const filteredMasters = masters.filter(master => {
    const query = searchQuery.toLowerCase();
    return (
      master.name?.toLowerCase().includes(query) ||
      master.phone?.toLowerCase().includes(query) ||
      master.region?.toLowerCase().includes(query)
    );
  });

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

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-red-50/30 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Xatolik: {(error as Error).message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="page-header bg-gradient-to-r from-slate-800 via-slate-700 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div className="slide-up">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Ustalar</h1>
            </div>
            <p className="text-sm text-white/80 ml-[60px]">Usta ishlari va ko'rsatkichlar</p>
          </div>
          {permissions?.canManageMasters && (
            <Button 
              className="gap-2 action-button bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => {
                setFormData({ name: '', phone: '', region: '', telegramId: '' });
                setIsCreateOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Yangi Usta Qo'shish
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 fade-in">
        <Card className="p-4 mb-6 shadow-lg border-0">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Usta kodi, ismi yoki telefon bo'yicha qidirish..."
                className="pl-10 search-input bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="stat-card shadow-lg border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Jami Ustalar</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{masters.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          <Card className="stat-card shadow-lg border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Faol Ustalar</p>
                <p className="text-3xl font-bold text-green-600">{masters.filter(m => m.lastLocationUpdate).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          <Card className="stat-card shadow-lg border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Hududlar</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(masters.map(m => m.region).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {filteredMasters.length === 0 ? (
          <Card className="p-12 text-center shadow-lg border-0">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Ustalar topilmadi</p>
            <p className="text-gray-400 text-sm mt-1">Qidiruv so'rovingizni o'zgartiring</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMasters.map((master, index) => (
              <Card 
                key={master.id} 
                className="p-6 list-item bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {master.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{master.name || 'Noma\'lum'}</h3>
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-sm">
                          Faol
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        ID: {master.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{master.phone || 'Telefon yo\'q'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewDialog(master)} className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {permissions?.canManageMasters && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(master)} className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(master.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700 dark:to-gray-700/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telegram ID</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{master.telegramId || 'Bog\'lanmagan'}</p>
                  </div>
                  <div className="text-center border-x border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hudud</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{master.region || 'Belgilanmagan'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Oxirgi faollik</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {master.lastLocationUpdate 
                        ? new Date(master.lastLocationUpdate).toLocaleDateString('uz-UZ')
                        : 'Ma\'lumot yo\'q'}
                    </p>
                  </div>
                </div>

                {(master.lastLat || master.lastLng) && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Joylashuv: {master.lastLat}, {master.lastLng}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Yangi Usta Qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Usta ismi *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Usta ismini kiriting"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon raqam</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="space-y-2">
              <Label>Hudud</Label>
              <Input 
                value={formData.region} 
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                placeholder="Masalan: Toshkent"
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram ID</Label>
              <Input 
                value={formData.telegramId} 
                onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
                placeholder="Telegram ID raqami"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleCreate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Ustani tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Usta ismi</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon raqam</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Hudud</Label>
              <Input 
                value={formData.region} 
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram ID</Label>
              <Input 
                value={formData.telegramId} 
                onChange={(e) => setFormData({...formData, telegramId: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleUpdate} disabled={submitting} className="gradient-bg border-0">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Usta profili</DialogTitle>
          </DialogHeader>
          {selectedMaster && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-100 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {selectedMaster.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedMaster.name}</h3>
                  <p className="text-muted-foreground">ID: {selectedMaster.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Telefon</p>
                  <p className="font-semibold">{selectedMaster.phone || '-'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Hudud</p>
                  <p className="font-semibold">{selectedMaster.region || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Telegram ID</p>
                  <p className="font-semibold">{selectedMaster.telegramId || '-'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Oxirgi faollik</p>
                  <p className="font-semibold">
                    {selectedMaster.lastLocationUpdate 
                      ? new Date(selectedMaster.lastLocationUpdate).toLocaleString('uz-UZ')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Yopish</Button>
            {permissions?.canManageMasters && selectedMaster && (
              <Button onClick={() => { setIsViewOpen(false); openEditDialog(selectedMaster); }} className="gradient-bg border-0">
                Tahrirlash
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
