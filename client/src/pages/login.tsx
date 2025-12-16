import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, AlertCircle, Phone, Users, Headphones } from 'lucide-react';
import brandoLogo from '@assets/Adobe_Express_-_file_1765916800203.png';

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
    <div className="min-h-screen w-full flex bg-slate-950">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(153,27,27,0.2),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(153,27,27,0.15),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="slide-up text-center mb-16">
            <img src={brandoLogo} alt="Brando" className="h-20 mx-auto mb-8" />
            <h2 className="text-2xl font-light text-white/80 tracking-wide">
              CallCenter CRM
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-800 to-transparent mx-auto mt-6" />
          </div>
          
          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 slide-up hover:bg-white/10 transition-all duration-300" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-red-800/20 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium text-white">Qo'ng'iroqlar Boshqaruvi</h3>
                <p className="text-sm text-white/50">Real-time call tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 slide-up hover:bg-white/10 transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-red-800/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium text-white">Mijozlar Bazasi</h3>
                <p className="text-sm text-white/50">Customer management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 slide-up hover:bg-white/10 transition-all duration-300" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-red-800/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium text-white">Operator Paneli</h3>
                <p className="text-sm text-white/50">Agent dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <img src={brandoLogo} alt="Brando" className="h-14 mx-auto mb-4" />
            <p className="text-sm text-slate-500">CallCenter CRM</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white mb-2">Tizimga kirish</h1>
              <p className="text-sm text-slate-400">Hisobingiz ma'lumotlarini kiriting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
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
                  className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-800 focus:ring-red-800/20"
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
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
                  className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-800 focus:ring-red-800/20"
                  data-testid="input-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-900/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 gap-2 text-base font-medium bg-red-800 hover:bg-red-900 text-white border-0 transition-all duration-200"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isLoading ? 'Kirish...' : 'Kirish'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center mb-4">
                Demo foydalanuvchilar
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setUsername('admin'); setPassword('admin2233'); }}
                  className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all duration-200 text-center group"
                >
                  <p className="text-xs font-medium text-slate-400 group-hover:text-white">Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername('operator'); setPassword('callcenter123'); }}
                  className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all duration-200 text-center group"
                >
                  <p className="text-xs font-medium text-slate-400 group-hover:text-white">Operator</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername('master'); setPassword('MS123'); }}
                  className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all duration-200 text-center group"
                >
                  <p className="text-xs font-medium text-slate-400 group-hover:text-white">Texnik</p>
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-600 mt-6">
            Brando CallCenter CRM v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
