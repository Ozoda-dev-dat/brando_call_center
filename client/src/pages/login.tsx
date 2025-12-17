import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, AlertCircle } from 'lucide-react';
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

  const handleDemoLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-800/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl p-4 px-6 inline-block mb-4 shadow-lg">
            <img src={brandoLogo} alt="Brando" className="h-14" />
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">CallCenter CRM</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Xush kelibsiz</h1>
            <p className="text-gray-400 text-sm">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Login
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomi"
                required
                disabled={isLoading}
                autoComplete="username"
                className="h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 rounded-xl focus:border-red-700 focus:ring-red-700/30 transition-all"
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Parol
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolingizni kiriting"
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 rounded-xl focus:border-red-700 focus:ring-red-700/30 transition-all"
                data-testid="input-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-800/50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 gap-2 text-base font-semibold bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white border-0 rounded-xl shadow-lg shadow-red-900/30 transition-all duration-300"
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

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-800/50 px-3 text-gray-500">Demo hisoblar</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin2233')}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-800/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-800/20 flex items-center justify-center mb-1 group-hover:bg-red-800/30 transition-colors">
                  <span className="text-red-400 font-bold text-sm">A</span>
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('operator', 'callcenter123')}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-800/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-800/20 flex items-center justify-center mb-1 group-hover:bg-red-800/30 transition-colors">
                  <span className="text-red-400 font-bold text-sm">O</span>
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Operator</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('master', 'MS123')}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-800/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-800/20 flex items-center justify-center mb-1 group-hover:bg-red-800/30 transition-colors">
                  <span className="text-red-400 font-bold text-sm">T</span>
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Texnik</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Brando CallCenter CRM v1.0
        </p>
      </div>
    </div>
  );
}
