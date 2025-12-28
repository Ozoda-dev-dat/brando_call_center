import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Loader } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ServiceCenter } from '@shared/schema';

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ServiceCenterWithStats extends ServiceCenter {
  activeOrders?: number;
  totalRevenue?: number;
}

export function ServiceCentersPanel() {
  const [centers, setCenters] = useState<ServiceCenterWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/service-centers');
      if (res.ok) {
        const data = await res.json();
        setCenters(data);
      }
    } catch (error) {
      console.error('Error fetching service centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setFormData({ ...formData, lat, lng });
    setMapPosition([lat, lng]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.region || formData.lat === 0 || formData.lng === 0) {
      alert('All fields are required');
      return;
    }

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId
        ? `/api/service-centers/${editingId}`
        : '/api/service-centers';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          region: formData.region,
          lat: formData.lat,
          lng: formData.lng,
        }),
      });

      if (res.ok) {
        fetchCenters();
        setShowDialog(false);
        setFormData({ name: '', region: '', lat: 0, lng: 0 });
        setMapPosition(null);
        setEditingId(null);
      } else {
        alert('Error saving service center');
      }
    } catch (error) {
      console.error('Error saving service center:', error);
      alert('Error saving service center');
    }
  };

  const handleEdit = (center: ServiceCenterWithStats) => {
    setEditingId(center.id);
    setFormData({
      name: center.name,
      region: center.region,
      lat: center.lat,
      lng: center.lng,
    });
    setMapPosition([center.lat, center.lng]);
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service center?')) return;

    try {
      const res = await fetch(`/api/service-centers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCenters();
      } else {
        alert('Error deleting service center');
      }
    } catch (error) {
      console.error('Error deleting service center:', error);
      alert('Error deleting service center');
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingId(null);
    setFormData({ name: '', region: '', lat: 0, lng: 0 });
    setMapPosition(null);
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Xizmat Markazlari</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Filiallar va qamrov hududlari</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Yangi Markaz
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Map */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[41.2995, 69.2401]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {centers.map((center) => (
                <Marker key={center.id} position={[center.lat, center.lng]} icon={defaultIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{center.name}</p>
                      <p className="text-xs text-gray-600">Hudud: {center.region}</p>
                      <p className="text-xs text-gray-600">Aktiv buyurtmalar: {center.activeOrders || 0}</p>
                      <p className="text-xs text-gray-600">Daromad: {center.totalRevenue?.toLocaleString() || 0} som</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* List */}
          <div className="w-96 flex flex-col gap-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Markazlar Ro'yxati</h2>
            <div className="space-y-3 flex-1">
              {centers.length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  Hech qanday xizmat markazi topilmadi
                </Card>
              ) : (
                centers.map((center) => (
                  <Card key={center.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{center.name}</h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> {center.region}
                          </p>
                          <p>GPS: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</p>
                          <p className="text-blue-600 dark:text-blue-400">
                            Aktiv: {center.activeOrders || 0} | Daromad: {(center.totalRevenue || 0).toLocaleString()} som
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(center)}
                          className="gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(center.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Markazni Tahrirlash' : 'Yangi Markaz Qo\'shish'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nomi</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Xizmat markazining nomi"
                />
              </div>
              <div>
                <Label>Hudud</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Mintaqa nomi"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Xaritada lokatsiyani tanlang (yoki koordinatalarni kiriting)</Label>
              <div className="h-64 rounded-lg overflow-hidden border">
                <MapContainer
                  center={mapPosition || [41.2995, 69.2401]}
                  zoom={5}
                  onClick={handleMapClick}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {mapPosition && <Marker position={mapPosition} icon={defaultIcon} />}
                </MapContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kenglik (Latitude)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                  placeholder="0.0000"
                />
              </div>
              <div>
                <Label>Uzunlik (Longitude)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                  placeholder="0.0000"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseDialog}>
                Bekor qilish
              </Button>
              <Button onClick={handleSave}>
                {editingId ? 'Saqlash' : 'Qo\'shish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
