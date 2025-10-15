import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Zap,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  ArrowRight,
  Microscope,
  Camera,
  RefreshCw,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';
import TallyStats from '../components/TallyStats';

export default function QAModule() {
  const [selectedIC, setSelectedIC] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Failed ICs queue - loaded from localStorage
  const [failedICs, setFailedICs] = useState([]);

  // Load failed ICs from localStorage on component mount
  useEffect(() => {
    const loadFailedICs = () => {
      const storedFailedICs = JSON.parse(localStorage.getItem('failedICs') || '[]');
      setFailedICs(storedFailedICs);
      
      // Update stats based on loaded ICs
      const pending = storedFailedICs.filter(ic => ic.status === 'pending').length;
      const reviewed = storedFailedICs.filter(ic => ic.status === 'reviewed').length;
      const confirmed_fake = storedFailedICs.filter(ic => ic.decision === 'confirmed_fake').length;
      const override_genuine = storedFailedICs.filter(ic => ic.decision === 'override_genuine').length;
      const escalated = storedFailedICs.filter(ic => ic.decision === 'escalated').length;
      
      setStats({
        pending,
        reviewed,
        confirmed_fake,
        override_genuine,
        escalated
      });
    };

    loadFailedICs();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(loadFailedICs, 2000);
    return () => clearInterval(interval);
  }, []);

  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    confirmed_fake: 0,
    override_genuine: 0,
    escalated: 0
  });

  const handleDecision = (icId, decision, notes = '') => {
    const updatedICs = failedICs.map(ic => 
      ic.id === icId 
        ? { ...ic, status: 'reviewed', decision, reviewNotes: notes, reviewedAt: new Date().toISOString() }
        : ic
    );
    
    setFailedICs(updatedICs);
    
    // Update localStorage
    localStorage.setItem('failedICs', JSON.stringify(updatedICs));
    
    // Update stats
    const pending = updatedICs.filter(ic => ic.status === 'pending').length;
    const reviewed = updatedICs.filter(ic => ic.status === 'reviewed').length;
    const confirmed_fake = updatedICs.filter(ic => ic.decision === 'confirmed_fake').length;
    const override_genuine = updatedICs.filter(ic => ic.decision === 'override_genuine').length;
    const escalated = updatedICs.filter(ic => ic.decision === 'escalated').length;
    
    setStats({
      pending,
      reviewed,
      confirmed_fake,
      override_genuine,
      escalated
    });
    
    setSelectedIC(null);
  };

  const filteredICs = failedICs.filter(ic => {
    const matchesFilter = filter === 'all' || ic.status === filter || 
                         (filter === 'high_priority' && ic.priority === 'high');
    const matchesSearch = ic.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ic.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ic.icType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <h1 className="text-2xl font-bold text-gray-900">VERITAS Quality Control</h1>
                <p className="text-gray-600">Phase 4: Expert Verification & Decision Making</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Pending Reviews</div>
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              </div>
              <Link 
                href="/admin?tab=analytics"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                View Analytics
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tally Statistics */}
        <TallyStats 
          className="mb-8"
          stats={[
            {
              icon: Clock,
              value: stats.pending,
              label: 'Pending Reviews',
              bgColor: 'bg-orange-100',
              iconColor: 'text-orange-600',
              valueColor: 'text-orange-600',
              change: 15.2
            },
            {
              icon: XCircle,
              value: stats.confirmed_fake,
              label: 'Confirmed Fakes',
              bgColor: 'bg-red-100',
              iconColor: 'text-red-600',
              valueColor: 'text-red-600',
              change: -8.5
            },
            {
              icon: CheckCircle,
              value: stats.override_genuine,
              label: 'Override Genuine',
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
              valueColor: 'text-green-600',
              change: 3.2
            },
            {
              icon: Activity,
              value: stats.reviewed,
              label: 'Total Reviewed',
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600',
              valueColor: 'text-blue-600',
              change: 12.8
            }
          ]}
        />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.confirmed_fake}</div>
            <div className="text-sm text-gray-600">Confirmed Fake</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.override_genuine}</div>
            <div className="text-sm text-gray-600">Override Genuine</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.escalated}</div>
            <div className="text-sm text-gray-600">Escalated</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            <div className="text-sm text-gray-600">Total Reviewed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - IC Queue */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Filter & Search
              </h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IC ID, manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter buttons */}
              <div className="space-y-2">
                {[
                  { key: 'pending', label: 'Pending Review', count: stats.pending },
                  { key: 'high_priority', label: 'High Priority', count: failedICs.filter(ic => ic.priority === 'high').length },
                  { key: 'reviewed', label: 'Reviewed', count: stats.reviewed },
                  { key: 'all', label: 'All Items', count: failedICs.length }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{filterOption.label}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {filterOption.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* IC Queue */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Review Queue
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredICs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No items match your filter criteria.</p>
                ) : (
                  filteredICs.map((ic) => (
                    <div
                      key={ic.id}
                      onClick={() => setSelectedIC(ic)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedIC?.id === ic.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm">{ic.id}</span>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ic.priority)}`}>
                            {ic.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ic.status)}`}>
                            {ic.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{ic.manufacturer} • {ic.icType}</p>
                      <p className="text-xs text-red-600 mb-2">{ic.failureReason}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(ic.timestamp).toLocaleString()}</span>
                        <span>Priority: {ic.priority}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Comparison */}
          <div className="lg:col-span-2 space-y-6">
            
            {selectedIC ? (
              <>
                {/* IC Details Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedIC.id}</h3>
                      <p className="text-gray-600">{selectedIC.manufacturer} • {selectedIC.icType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(selectedIC.priority)}`}>
                        {selectedIC.priority} priority
                      </span>
                      <span className="text-sm text-gray-500">
                        PO: {selectedIC.poNumber}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Failure Reason:</span>
                      <p className="font-medium text-red-600">{selectedIC.failureReason}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <p className={`font-medium ${selectedIC.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {selectedIC.priority.charAt(0).toUpperCase() + selectedIC.priority.slice(1)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Scanned:</span>
                      <p className="font-medium">{new Date(selectedIC.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Image Comparison */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Visual Comparison
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Golden Reference */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Golden Reference (Expected)
                      </h5>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-green-200">
                        <div className="text-center">
                          <ICChipLogo className="h-16 w-16 mx-auto mb-2 text-green-600" />
                          <p className="text-sm text-gray-600">Golden Reference Image</p>
                          <p className="text-xs text-gray-500">{selectedIC.manufacturer}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scanned Image */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-red-600" />
                        Scanned IC (Actual)
                      </h5>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-red-200">
                        <div className="text-center">
                          <ICChipLogo className="h-16 w-16 mx-auto mb-2 text-red-600" />
                          <p className="text-sm text-gray-600">Scanned IC Image</p>
                          <p className="text-xs text-gray-500">Suspected Counterfeit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Differences */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Detected Differences
                  </h4>
                  
                  <div className="space-y-3">
                    {selectedIC.differences.map((diff, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          diff.severity === 'high'
                            ? 'border-red-500 bg-red-50'
                            : diff.severity === 'medium'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{diff.type}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            diff.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : diff.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {diff.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{diff.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Panel */}
                {selectedIC.status === 'pending' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      QA Decision
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleDecision(selectedIC.id, 'confirmed_fake')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                        Confirm Fake
                      </button>
                      
                      <button
                        onClick={() => handleDecision(selectedIC.id, 'override_genuine')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Override (Genuine)
                      </button>
                      
                      <button
                        onClick={() => handleDecision(selectedIC.id, 'escalated')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                      >
                        <AlertTriangle className="h-5 w-5" />
                        Escalate
                      </button>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Microscope className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Physical Inspection Recommended</p>
                          <p>For critical decisions, consider using a microscope to verify the markings physically before making your final decision.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Previous Decision (if reviewed) */}
                {selectedIC.status === 'reviewed' && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Review Decision
                    </h4>
                    
                    <div className={`p-4 rounded-lg ${
                      selectedIC.decision === 'confirmed_fake'
                        ? 'bg-red-50 border border-red-200'
                        : selectedIC.decision === 'override_genuine'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedIC.decision === 'confirmed_fake' && <XCircle className="h-5 w-5 text-red-600" />}
                        {selectedIC.decision === 'override_genuine' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {selectedIC.decision === 'escalated' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        <span className="font-medium capitalize">
                          {selectedIC.decision?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reviewed on {new Date(selectedIC.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No IC Selected */
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an IC for Review</h3>
                <p className="text-gray-600 mb-6">
                  Choose an IC from the queue on the left to start the detailed comparison and review process.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visual Comparison
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Difference Analysis
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Decision Making
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
