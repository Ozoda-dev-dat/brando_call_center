import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LogIn, AlertCircle, Factory, Wrench, ClipboardList, Users, Cog } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login muvaffaqiyatsiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="slide-up">
            <div className="flex items-center gap-4 mb-6">
              <Factory className="w-14 h-14" />
              <h1 className="text-5xl font-bold">Zavod CRM</h1>
            </div>
            <p className="text-xl text-white/90 mb-12 max-w-md">
              Ishlab chiqarish va xizmat ko'rsatishni boshqarish tizimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Buyurtmalar Nazorati</h3>
                <p className="text-sm text-white/70">Ishlab chiqarish buyurtmalari</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Ustalar va Texniklar</h3>
                <p className="text-sm text-white/70">Ishchi kuchini boshqarish</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Cog className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Texnik Xizmat</h3>
                <p className="text-sm text-white/70">Ta'mirlash va xizmat ko'rsatish</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md p-8 shadow-xl scale-in glass-card">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-4">
              <div className="w-16 h-16 gradient-bg rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Zavod CRM</h1>
            <p className="text-sm text-muted-foreground">Tizimga kirish uchun ma'lumotlarni kiriting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Login
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Loginni kiriting"
                required
                disabled={isLoading}
                className="h-12 search-input"
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Parol
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
                required
                disabled={isLoading}
                className="h-12 search-input"
                data-testid="input-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg fade-in">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 gap-2 text-base font-semibold action-button gradient-bg border-0"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? 'Kirish...' : 'Tizimga Kirish'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo foydalanuvchilar:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setUsername('admin'); setPassword('admin2233'); }}
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800/60 transition-colors text-center"
              >
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Direktor</p>
              </button>
              <button
                type="button"
                onClick={() => { setUsername('operator'); setPassword('callcenter123'); }}
                className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-center"
              >
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Dispetcher</p>
              </button>
              <button
                type="button"
                onClick={() => { setUsername('master'); setPassword('MS123'); }}
                className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-center"
              >
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Texnik</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
