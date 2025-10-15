import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Camera,
  Zap
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data for charts and statistics - reset to 0
  const [reportData, setReportData] = useState({
    overview: {
      totalScanned: 0,
      passRate: 0,
      failRate: 0,
      qaReviewed: 0,
      confirmedFakes: 0,
      overrideGenuine: 0,
      avgScanRate: 0,
      systemUptime: 99.8
    },
    manufacturers: [],
    trends: {
      daily: []
    },
    alerts: []
  });

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const reportTypes = [
    { id: 'overview', name: 'System Overview', icon: BarChart3 },
    { id: 'manufacturers', name: 'Manufacturer Analysis', icon: Building2 },
    { id: 'qa', name: 'QA Performance', icon: Users },
    { id: 'security', name: 'Security Report', icon: Shield },
    { id: 'trends', name: 'Trend Analysis', icon: TrendingUp }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReliabilityColor = (reliability) => {
    switch (reliability) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ICChipLogo className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VERITAS System Reports</h1>
                <p className="text-gray-600">Analytics, Trends & Performance Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Report Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <report.icon className="h-4 w-4" />
                  {report.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        {selectedReport === 'overview' && (
          <div className="space-y-8">
            
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Scanned</p>
                    <p className="text-3xl font-bold text-blue-600">{reportData.overview.totalScanned.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">12.5%</span>
                  <span className="text-gray-600 ml-2">vs previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-green-600">{reportData.overview.passRate}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">0.3%</span>
                  <span className="text-gray-600 ml-2">improvement</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed Fakes</p>
                    <p className="text-3xl font-bold text-red-600">{reportData.overview.confirmedFakes}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">2.1%</span>
                  <span className="text-gray-600 ml-2">decrease</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-purple-600">{reportData.overview.systemUptime}%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">Excellent</span>
                  <span className="text-gray-600 ml-2">performance</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Scanning Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Scanning Trends</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {reportData.trends.daily.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                        <div 
                          className="bg-blue-500 rounded-t absolute bottom-0 w-full"
                          style={{ height: `${(day.scanned / 1400) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>ICs Scanned</span>
                  </div>
                </div>
              </div>

              {/* Pass/Fail Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass/Fail Distribution</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    {/* Simplified donut chart representation */}
                    <div className="w-full h-full rounded-full border-8 border-green-500 relative">
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-red-500"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (reportData.overview.failRate / 100) * 50}% 0%, 100% 100%, 0% 100%)` 
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{reportData.overview.passRate}%</div>
                          <div className="text-sm text-gray-600">Pass Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Passed ({reportData.overview.passRate}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Failed ({reportData.overview.failRate}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Recent System Alerts
              </h3>
              <div className="space-y-3">
                {reportData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high'
                        ? 'border-red-500 bg-red-50'
                        : alert.severity === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{alert.type.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'manufacturers' && (
          <div className="space-y-8">
            
            {/* Manufacturer Performance Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Manufacturer Performance Analysis</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total ICs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pass Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fake Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reliability
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.manufacturers.map((manufacturer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{manufacturer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {manufacturer.totalICs.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${manufacturer.passRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{manufacturer.passRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            manufacturer.fakeRate < 1 ? 'text-green-600' :
                            manufacturer.fakeRate < 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {manufacturer.fakeRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getReliabilityColor(manufacturer.reliability)}`}>
                            {manufacturer.reliability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manufacturer Comparison Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass Rate Comparison</h3>
              <div className="space-y-4">
                {reportData.manufacturers.map((manufacturer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-32 text-sm text-gray-700 truncate">{manufacturer.name}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            manufacturer.passRate >= 98 ? 'bg-green-500' :
                            manufacturer.passRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${manufacturer.passRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-900 text-right">{manufacturer.passRate}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder content for other report types */}
        {selectedReport !== 'overview' && selectedReport !== 'manufacturers' && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Detailed {selectedReport} analytics and insights will be displayed here.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
