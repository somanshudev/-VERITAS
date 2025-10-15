import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample manufacturer credentials for demo
  const sampleCredentials = [
    {
      email: 'ti@texasinstruments.com',
      password: 'TI2025',
      company: 'Texas Instruments',
      status: 'approved'
    },
    {
      email: 'admin@analog.com',
      password: 'AD2025',
      company: 'Analog Devices',
      status: 'approved'
    },
    {
      email: 'contact@microchip.com',
      password: 'MC2025',
      company: 'Microchip Technology',
      status: 'pending'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check credentials
    const user = sampleCredentials.find(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (user) {
      if (user.status === 'approved') {
        // Store user session (in real app, this would be handled by proper auth)
        localStorage.setItem('manufacturerUser', JSON.stringify({
          email: user.email,
          company: user.company,
          status: user.status,
          loginTime: new Date().toISOString()
        }));
        
        // Redirect to manufacturer portal
        router.push('/manufacturer');
      } else {
        setError('Your account is pending approval from BHEL. Please wait for verification.');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  const fillSampleCredentials = (credentialIndex) => {
    const cred = sampleCredentials[credentialIndex];
    setFormData({
      email: cred.email,
      password: cred.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ICChipLogo className="h-16 w-16 text-white" animate={true} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">VERITAS Login</h1>
            <p className="text-blue-200">Access BHEL Verification Portal</p>
          </div>

          {/* Sample Credentials Info */}
          <div className="mb-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <h3 className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Demo Credentials
            </h3>
            <div className="space-y-2 text-xs">
              {sampleCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillSampleCredentials(index)}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{cred.company}</div>
                      <div className="text-blue-200">{cred.email}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      cred.status === 'approved' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {cred.status === 'approved' ? (
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                      )}
                      {cred.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-blue-200">
              Don't have an account?{' '}
              <Link href="/manufacturer" className="text-white font-medium hover:underline">
                Register as Manufacturer
              </Link>
            </div>
            
            <div className="text-xs text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            Secure VERITAS Authentication
          </div>
        </div>
      </div>
    </div>
  );
}
