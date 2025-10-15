import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Settings, 
  Users, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  FileText,
  Shield,
  AlertTriangle,
  Eye,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Activity,
  Target,
  TrendingUp,
  Zap,
  LogOut
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';
import TallyStats from '../components/TallyStats';

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Mock data for manufacturers - moved to top to avoid hook order issues
  const [manufacturers, setManufacturers] = useState([
    {
      id: 1,
      name: 'Texas Instruments',
      email: 'supply@ti.com',
      phone: '+1-800-336-5236',
      status: 'approved',
      registeredDate: '2024-12-15',
      lastActivity: '2025-01-15',
      totalPOs: 15,
      successRate: 98.5,
      contactPerson: 'John Smith',
      address: 'Dallas, TX, USA'
    },
    {
      id: 2,
      name: 'Analog Devices',
      email: 'procurement@analog.com',
      phone: '+1-781-329-4700',
      status: 'approved',
      registeredDate: '2024-11-22',
      lastActivity: '2025-01-14',
      totalPOs: 8,
      successRate: 96.2,
      contactPerson: 'Sarah Johnson',
      address: 'Wilmington, MA, USA'
    },
    {
      id: 3,
      name: 'Microchip Technology',
      email: 'sales@microchip.com',
      phone: '+1-480-792-7200',
      status: 'pending',
      registeredDate: '2025-01-10',
      lastActivity: '2025-01-12',
      totalPOs: 0,
      successRate: 0,
      contactPerson: 'Mike Chen',
      address: 'Chandler, AZ, USA'
    },
    {
      id: 4,
      name: 'Suspicious Electronics Ltd',
      email: 'contact@suspicious.com',
      phone: '+86-123-456-7890',
      status: 'rejected',
      registeredDate: '2025-01-08',
      lastActivity: '2025-01-08',
      totalPOs: 0,
      successRate: 0,
      contactPerson: 'Unknown',
      address: 'Unknown Location'
    }
  ]);

  // System statistics - loaded from localStorage and updated in real-time
  const [systemStats, setSystemStats] = useState({
    totalManufacturers: 4,
    approvedManufacturers: 2,
    pendingApprovals: 1,
    rejectedManufacturers: 1,
    totalPOs: 0,
    activePOs: 0,
    completedPOs: 0,
    totalICsScanned: 0,
    passedICs: 0,
    failedICs: 0,
    qaReviewed: 0,
    confirmedFakes: 0,
    overrideGenuine: 0,
    systemUptime: '99.8%',
    avgScanRate: 0
  });

  // Load and update system stats from localStorage
  useEffect(() => {
    const updateSystemStats = () => {
      // Get scanning stats from localStorage
      const scanningStats = JSON.parse(localStorage.getItem('scanningStats') || '{"total": 0, "passed": 0, "failed": 0}');
      
      // Get failed ICs for QA stats
      const failedICs = JSON.parse(localStorage.getItem('failedICs') || '[]');
      const qaReviewed = failedICs.filter(ic => ic.status === 'reviewed').length;
      const confirmedFakes = failedICs.filter(ic => ic.decision === 'confirmed_fake').length;
      const overrideGenuine = failedICs.filter(ic => ic.decision === 'override_genuine').length;
      
      setSystemStats(prev => ({
        ...prev,
        totalICsScanned: scanningStats.total,
        passedICs: scanningStats.passed,
        failedICs: scanningStats.failed,
        qaReviewed,
        confirmedFakes,
        overrideGenuine,
        avgScanRate: scanningStats.rate || 0
      }));
    };

    updateSystemStats();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(updateSystemStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Check admin authentication
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        setAdminUser(session);
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid session, redirect to login
        router.push('/admin-login');
      }
    } else {
      // No session, redirect to login
      router.push('/admin-login');
    }
  }, [router]);

  // Check URL parameters for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'manufacturers', 'users', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin-login');
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <ICChipLogo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleManufacturerAction = (id, action) => {
    setManufacturers(prev => prev.map(m => 
      m.id === id ? { ...m, status: action } : m
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredManufacturers = manufacturers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: BarChart3 },
    { id: 'manufacturers', name: 'Manufacturer Management', icon: Building2 },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'analytics', name: 'Reports & Analytics', icon: FileText },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Single Admin Navigation Bar */}
      <nav className="relative bg-gradient-to-r from-white/20 via-blue-100/30 to-white/20 border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl shadow-2xl backdrop-saturate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo - VERITAS Branding */}
            <Link href="/" className="flex items-center gap-3 group">
              <ICChipLogo className="h-10 w-10 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xl font-bold text-gray-900 leading-tight">VERITAS Admin</span>
            </Link>

            {/* Admin Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                  activeTab === 'overview' 
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('manufacturers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                  activeTab === 'manufacturers' 
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Manufacturers</span>
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                  activeTab === 'analytics' 
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                  activeTab === 'users' 
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </button>
            </div>

            {/* Admin User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-medium text-gray-900">{adminUser?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Tally Statistics */}
            <TallyStats 
              className="mb-8"
              stats={[
                {
                  icon: Activity,
                  value: systemStats.totalICsScanned,
                  label: 'Total ICs Scanned',
                  bgColor: 'bg-blue-100',
                  iconColor: 'text-blue-600',
                  valueColor: 'text-blue-600',
                  change: 12.5
                },
                {
                  icon: Building2,
                  value: systemStats.approvedManufacturers,
                  label: 'Active Manufacturers',
                  bgColor: 'bg-purple-100',
                  iconColor: 'text-purple-600',
                  valueColor: 'text-purple-600',
                  change: 8.3
                },
                {
                  icon: XCircle,
                  value: systemStats.confirmedFakes,
                  label: 'Confirmed Fakes',
                  bgColor: 'bg-red-100',
                  iconColor: 'text-red-600',
                  valueColor: 'text-red-600',
                  change: -15.2
                },
                {
                  icon: Zap,
                  value: systemStats.systemUptime,
                  label: 'System Uptime',
                  bgColor: 'bg-green-100',
                  iconColor: 'text-green-600',
                  valueColor: 'text-green-600',
                  change: 0.2
                }
              ]}
            />
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total ICs Scanned</p>
                    <p className="text-3xl font-bold text-blue-600">{systemStats.totalICsScanned.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">↗ 12.5%</span>
                  <span className="text-gray-600 ml-2">vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Detection Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {systemStats.totalICsScanned > 0 ? ((systemStats.passedICs / systemStats.totalICsScanned) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">↗ 0.3%</span>
                  <span className="text-gray-600 ml-2">accuracy improvement</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Manufacturers</p>
                    <p className="text-3xl font-bold text-purple-600">{systemStats.approvedManufacturers}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-yellow-600 font-medium">{systemStats.pendingApprovals}</span>
                  <span className="text-gray-600 ml-2">pending approval</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-orange-600">{systemStats.systemUptime}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">Excellent</span>
                  <span className="text-gray-600 ml-2">reliability</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* QA Statistics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QA Review Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-bold text-blue-600">{systemStats.qaReviewed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Confirmed Fakes</span>
                    <span className="font-bold text-red-600">{systemStats.confirmedFakes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Override Genuine</span>
                    <span className="font-bold text-green-600">{systemStats.overrideGenuine}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fake Detection Rate</span>
                      <span className="font-bold text-orange-600">
                        {((systemStats.confirmedFakes / systemStats.qaReviewed) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Scan Rate (per min)</span>
                    <span className="font-bold text-blue-600">{systemStats.avgScanRate}/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active POs</span>
                    <span className="font-bold text-green-600">{systemStats.activePOs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed POs</span>
                    <span className="font-bold text-purple-600">{systemStats.completedPOs}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600">
                        {systemStats.totalPOs > 0 ? ((systemStats.completedPOs / systemStats.totalPOs) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manufacturers' && (
          <div className="space-y-6">
            
            {/* Search and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Manufacturer Management</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Manufacturer
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search manufacturers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Manufacturers List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredManufacturers.map((manufacturer) => (
                      <tr key={manufacturer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{manufacturer.name}</div>
                            <div className="text-sm text-gray-500">{manufacturer.email}</div>
                            <div className="text-xs text-gray-400">{manufacturer.contactPerson}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(manufacturer.status)}`}>
                            {manufacturer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{manufacturer.totalPOs} POs</div>
                            <div className="text-xs text-gray-500">{manufacturer.successRate}% success</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(manufacturer.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {manufacturer.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleManufacturerAction(manufacturer.id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleManufacturerAction(manufacturer.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 mb-6">
              Manage system users, roles, and permissions for operators, QA team, and administrators.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Plus className="h-4 w-4" />
              Add New User
            </button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                System Reports & Analytics
              </h3>
              <p className="text-gray-600">
                Comprehensive analytics and performance insights for the VERITAS system.
              </p>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total ICs Scanned</p>
                    <p className="text-3xl font-bold text-blue-600">{systemStats.totalICsScanned.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">Live Data</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {systemStats.totalICsScanned > 0 ? 
                        ((systemStats.passedICs / systemStats.totalICsScanned) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Passed ({systemStats.passedICs})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Failed ({systemStats.failedICs})</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">QA Reviewed</p>
                    <p className="text-3xl font-bold text-orange-600">{systemStats.qaReviewed}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">
                    {Math.max(systemStats.failedICs - systemStats.qaReviewed, 0)} pending review
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed Fakes</p>
                    <p className="text-3xl font-bold text-red-600">{systemStats.confirmedFakes}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">
                    {systemStats.overrideGenuine} overridden as genuine
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Pass/Fail Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass/Fail Distribution</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    <div className="w-full h-full rounded-full border-8 border-green-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {systemStats.totalICsScanned > 0 ? 
                              ((systemStats.passedICs / systemStats.totalICsScanned) * 100).toFixed(1) : 0}%
                          </div>
                          <div className="text-sm text-gray-600">Pass Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Passed ({systemStats.passedICs})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Failed ({systemStats.failedICs})</span>
                  </div>
                </div>
              </div>

              {/* QA Decision Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QA Decision Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confirmed Fake</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ 
                            width: systemStats.qaReviewed > 0 ? 
                              `${(systemStats.confirmedFakes / systemStats.qaReviewed) * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{systemStats.confirmedFakes}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Override Genuine</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: systemStats.qaReviewed > 0 ? 
                              `${(systemStats.overrideGenuine / systemStats.qaReviewed) * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{systemStats.overrideGenuine}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ 
                            width: systemStats.failedICs > 0 ? 
                              `${((systemStats.failedICs - systemStats.qaReviewed) / systemStats.failedICs) * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{systemStats.failedICs - systemStats.qaReviewed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Summary Report
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export QA Report
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Export Full Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">System Reports</h3>
            <p className="text-gray-600 mb-6">
              Generate comprehensive reports on system performance, manufacturer reliability, and counterfeit detection statistics.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Generate Report
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 mb-6">
              Configure system parameters, scanning thresholds, notification settings, and security policies.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Settings className="h-4 w-4" />
              Configure Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
