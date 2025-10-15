import { useState } from 'react';
import { useRouter } from 'next/router';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('veritas2025');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple admin credentials check
    if (username === 'admin' && password === 'veritas2025') {
      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({
        username: 'admin',
        loginTime: new Date().toISOString(),
        role: 'administrator'
      }));
      
      // Redirect to admin panel
      router.push('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative flex items-start justify-center p-4 pt-16">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mt-3 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-blue-100">
            <button onClick={() => router.push('/')} className="hover:text-white transition-colors text-sm">
              ← Back to Home
            </button>
            <div className="text-xs opacity-90">VERITAS Admin Login</div>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ICChipLogo className="h-16 w-16 text-white" animate={true} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VERITAS Admin</h1>
          <p className="text-blue-200">Administrator Access Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter admin username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-300 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-300 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Demo Autofill */}
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm transition-colors"
            >
              Use Demo Credentials
            </button>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-100 text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-blue-200 text-xs">Username: <span className="font-mono">admin</span></p>
            <p className="text-blue-200 text-xs">Password: <span className="font-mono">veritas2025</span></p>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="text-center mt-6 text-blue-200 text-xs opacity-80">Secure administrator access</div>
      </div>
    </div>
  );
}
