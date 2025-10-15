import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Globe, Calendar, Filter, PieChart, Activity, Shield, XCircle } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const stats = [
    {
      title: 'Total Verifications',
      value: '45,231',
      change: '+12.5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'blue',
    },
    {
      title: 'Genuine ICs',
      value: '42,890',
      change: '+8.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Counterfeit Detected',
      value: '2,341',
      change: '+23.1%',
      trend: 'up',
      icon: XCircle,
      color: 'red',
    },
    {
      title: 'Detection Rate',
      value: '94.8%',
      change: '+2.1%',
      trend: 'up',
      icon: Shield,
      color: 'purple',
    },
  ];

  // Most Verified IC Brands
  const topManufacturers = [
    { name: 'Texas Instruments', verifications: 12450, genuine: 11890, counterfeit: 560, percentage: 27.5, color: '#3b82f6' },
    { name: 'STMicroelectronics', verifications: 8920, genuine: 8520, counterfeit: 400, percentage: 19.7, color: '#10b981' },
    { name: 'NXP Semiconductors', verifications: 7340, genuine: 7010, counterfeit: 330, percentage: 16.2, color: '#8b5cf6' },
    { name: 'Analog Devices', verifications: 5680, genuine: 5420, counterfeit: 260, percentage: 12.6, color: '#f59e0b' },
    { name: 'Microchip Technology', verifications: 4230, genuine: 4050, counterfeit: 180, percentage: 9.4, color: '#ef4444' },
  ];

  // Counterfeit Detection Trends (Monthly)
  const counterfeitTrends = [
    { month: 'Apr', genuine: 3200, counterfeit: 180, suspicious: 120 },
    { month: 'May', genuine: 3500, counterfeit: 210, suspicious: 140 },
    { month: 'Jun', genuine: 3800, counterfeit: 245, suspicious: 165 },
    { month: 'Jul', genuine: 3600, counterfeit: 280, suspicious: 190 },
    { month: 'Aug', genuine: 3900, counterfeit: 320, suspicious: 210 },
    { month: 'Sep', genuine: 4100, counterfeit: 380, suspicious: 245 },
    { month: 'Oct', genuine: 4300, counterfeit: 426, suspicious: 280 },
  ];

  // Common Fake IC Models
  const commonFakeModels = [
    { model: 'TPS54360DDAR', brand: 'Texas Instruments', fakeCount: 234, riskLevel: 'High', percentage: 18.5 },
    { model: 'LM358DR', brand: 'Texas Instruments', fakeCount: 189, riskLevel: 'High', percentage: 14.9 },
    { model: 'STM32F103C8T6', brand: 'STMicroelectronics', fakeCount: 156, riskLevel: 'Medium', percentage: 12.3 },
    { model: 'NE555P', brand: 'Texas Instruments', fakeCount: 142, riskLevel: 'Medium', percentage: 11.2 },
    { model: 'ATmega328P', brand: 'Microchip', fakeCount: 128, riskLevel: 'Medium', percentage: 10.1 },
    { model: 'LM2596S', brand: 'Texas Instruments', fakeCount: 115, riskLevel: 'Low', percentage: 9.1 },
    { model: 'AMS1117', brand: 'Advanced Monolithic', fakeCount: 98, riskLevel: 'Low', percentage: 7.7 },
  ];

  // Region-wise Fake IC Reports
  const regionalFakeReports = [
    { region: 'Asia Pacific', total: 15234, fake: 1245, percentage: 8.2, trend: '+15%', color: '#ef4444' },
    { region: 'Europe', total: 12890, fake: 645, percentage: 5.0, trend: '+8%', color: '#f59e0b' },
    { region: 'North America', total: 11450, fake: 287, percentage: 2.5, trend: '+3%', color: '#10b981' },
    { region: 'Latin America', total: 3890, fake: 117, percentage: 3.0, trend: '+12%', color: '#f59e0b' },
    { region: 'Middle East & Africa', total: 1767, fake: 47, percentage: 2.7, trend: '+5%', color: '#10b981' },
  ];

  // Verification Status Distribution (for Pie Chart)
  const verificationDistribution = [
    { status: 'Genuine', count: 42890, percentage: 94.8, color: '#10b981' },
    { status: 'Counterfeit', count: 2341, percentage: 5.2, color: '#ef4444' },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      red: 'from-red-500 to-red-600',
    };
    return colors[color];
  };

  const getRiskColor = (level) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800',
    };
    return colors[level];
  };

  return (
    <div className="min-h-screen bg-tech-light py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-tech-gray">Comprehensive insights into IC verification trends</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-lg">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Brands</option>
                <option value="ti">Texas Instruments</option>
                <option value="st">STMicroelectronics</option>
                <option value="nxp">NXP Semiconductors</option>
                <option value="ad">Analog Devices</option>
                <option value="microchip">Microchip Technology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Regions</option>
                <option value="asia">Asia Pacific</option>
                <option value="europe">Europe</option>
                <option value="na">North America</option>
                <option value="latam">Latin America</option>
                <option value="mea">Middle East & Africa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`card bg-gradient-to-br ${getColorClass(stat.color)} text-white`}>
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="h-8 w-8 opacity-80" />
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-white' : 'text-white'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Counterfeit Detection Trends - Line Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary-600" />
              Counterfeit Detection Trends
            </h2>
            <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
              <div className="h-full flex flex-col">
                {/* Chart Area */}
                <div className="flex-1 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-tech-gray">
                    <span>5000</span>
                    <span>4000</span>
                    <span>3000</span>
                    <span>2000</span>
                    <span>1000</span>
                    <span>0</span>
                  </div>
                  {/* Chart bars */}
                  <div className="ml-12 h-full flex items-end justify-between gap-2">
                    {counterfeitTrends.map((data, index) => {
                      const total = data.genuine + data.counterfeit + data.suspicious;
                      const maxHeight = 5000;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: '100%' }}>
                            <div 
                              className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                              style={{ height: `${(data.genuine / maxHeight) * 100}%` }}
                              title={`Genuine: ${data.genuine}`}
                            ></div>
                            <div 
                              className="w-full bg-red-500 transition-all hover:bg-red-600"
                              style={{ height: `${(data.counterfeit / maxHeight) * 100}%` }}
                              title={`Counterfeit: ${data.counterfeit}`}
                            ></div>
                            <div 
                              className="w-full bg-yellow-500 transition-all hover:bg-yellow-600"
                              style={{ height: `${(data.suspicious / maxHeight) * 100}%` }}
                              title={`Suspicious: ${data.suspicious}`}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* X-axis labels */}
                <div className="ml-12 flex justify-between mt-2 text-xs text-tech-gray font-medium">
                  {counterfeitTrends.map((data, index) => (
                    <span key={index} className="flex-1 text-center">{data.month}</span>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Genuine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Counterfeit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Suspicious</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Most Verified IC Brands - Bar Chart */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary-600" />
                Most Verified IC Brands
              </h2>
              <div className="space-y-4">
                {topManufacturers.map((manufacturer, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm">{manufacturer.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-tech-dark">
                          {manufacturer.verifications.toLocaleString()}
                        </span>
                        <span className="text-xs text-tech-gray ml-2">
                          ({manufacturer.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(manufacturer.genuine / manufacturer.verifications) * 100}%`,
                            backgroundColor: '#10b981'
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(manufacturer.counterfeit / manufacturer.verifications) * 100}%`,
                            backgroundColor: '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-tech-gray mt-1">
                      <span>✓ {manufacturer.genuine.toLocaleString()} genuine</span>
                      <span>✗ {manufacturer.counterfeit} counterfeit</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status - Pie Chart */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-6 w-6 text-primary-600" />
                Verification Status Distribution
              </h2>
              <div className="flex flex-col items-center">
                {/* Pie Chart Visualization */}
                <div className="relative w-48 h-48 mb-6">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Genuine segment (94.8%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray="251.2 251.2"
                      strokeDashoffset="0"
                    />
                    {/* Counterfeit segment (5.2%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray="13.1 251.2"
                      strokeDashoffset="-238.1"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-tech-dark">
                        {verificationDistribution[0].percentage}%
                      </div>
                      <div className="text-xs text-tech-gray">Genuine</div>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="w-full space-y-3">
                  {verificationDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-semibold">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-tech-dark">{item.count.toLocaleString()}</div>
                        <div className="text-xs text-tech-gray">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Common Fake IC Models */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Common Fake IC Models
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">IC Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Brand</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Fake Count</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">% of Total</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commonFakeModels.map((model, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-tech-gray">#{index + 1}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-sm">{model.model}</td>
                      <td className="px-4 py-3 text-sm text-tech-gray">{model.brand}</td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">{model.fakeCount}</td>
                      <td className="px-4 py-3 text-center text-sm text-tech-gray">{model.percentage}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(model.riskLevel)}`}>
                          {model.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Region-wise Fake IC Reports */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary-600" />
              Region-wise Fake IC Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionalFakeReports.map((region, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-tech-dark">{region.region}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      region.percentage > 7 ? 'bg-red-100 text-red-700' :
                      region.percentage > 4 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {region.trend}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-tech-gray">Total Verifications</span>
                      <span className="font-semibold">{region.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tech-gray">Fake Detected</span>
                      <span className="font-bold text-red-600">{region.fake}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${region.percentage}%`,
                          backgroundColor: region.color
                        }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold" style={{ color: region.color }}>
                        {region.percentage}%
                      </span>
                      <span className="text-xs text-tech-gray ml-1">fake rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
