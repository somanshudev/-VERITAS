import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building2, Lock, Mail, Upload, Database, FileText, Shield, CheckCircle, Plus, Edit2, Trash2, LogOut, User, Image as ImageIcon, Calendar, Hash, Eye, EyeOff, FileSpreadsheet, Download, Loader2, X, Activity, Target, TrendingUp } from 'lucide-react';
import TallyStats from '../components/TallyStats';

export default function Manufacturer() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Login/Signup form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Upload form states
  const [manufacturerName, setManufacturerName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [dateCodeFormat, setDateCodeFormat] = useState('');
  const [batchCodeFormat, setBatchCodeFormat] = useState('');
  
  // Bulk upload states
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  
  // Uploaded data state - starting empty
  const [uploadedData, setUploadedData] = useState([]);
  
  // Check for existing authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('manufacturerUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo(user);
      setIsLoggedIn(true);
      setEmail(user.email);
      setCompanyName(user.company);
    }
  }, []);

  // Fetch entries from database when logged in
  useEffect(() => {
    if (isLoggedIn && email) {
      fetchEntries();
    }
  }, [isLoggedIn, email]);
  
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manufacturer/entries?companyEmail=${email}`);
      const data = await response.json();
      
      if (data.success) {
        // Convert MongoDB _id to id for compatibility
        const entries = data.data.map(entry => ({
          ...entry,
          id: entry._id,
          dateUploaded: new Date(entry.dateUploaded).toLocaleDateString()
        }));
        // Seed demo entries for TI if none
        let finalEntries = entries;
        const isTexasInstruments = (email || '').toLowerCase().includes('texasinstruments') || (companyName || '').toLowerCase().includes('texas');
        if (isTexasInstruments && (!entries || entries.length === 0)) {
          const today = new Date().toLocaleDateString();
          finalEntries = [
            {
              id: `demo-${Date.now()}-1`,
              manufacturerName: 'Texas Instruments',
              partNumber: 'TPS54360DDAR',
              dateCodeFormat: 'YYWW',
              batchCodeFormat: 'LXXXXXX',
              dateUploaded: today,
              status: 'Verified',
              logoImage: null,
              companyEmail: email
            },
            {
              id: `demo-${Date.now()}-2`,
              manufacturerName: 'Texas Instruments',
              partNumber: 'TL074CN',
              dateCodeFormat: 'YYWWD',
              batchCodeFormat: 'LXXXXXX',
              dateUploaded: today,
              status: 'Verified',
              logoImage: null,
              companyEmail: email
            },
            {
              id: `demo-${Date.now()}-3`,
              manufacturerName: 'Texas Instruments',
              partNumber: 'INA219AIDR',
              dateCodeFormat: 'YYWW',
              batchCodeFormat: 'LXXXXXX',
              dateUploaded: today,
              status: 'Verified',
              logoImage: null,
              companyEmail: email
            }
          ];
        }
        setUploadedData(finalEntries);

        // Sync verified entries to goldenEntries in localStorage for operator OCR use
        try {
          const existing = JSON.parse(localStorage.getItem('goldenEntries') || '[]');
          const filtered = existing.filter(e => e.companyEmail !== email);
          const verifiedForThisCompany = (finalEntries || []).filter(e => e.status === 'Verified').map(e => ({
            manufacturerName: e.manufacturerName,
            partNumber: e.partNumber,
            dateCodeFormat: e.dateCodeFormat,
            batchCodeFormat: e.batchCodeFormat,
            companyEmail: email
          }));
          localStorage.setItem('goldenEntries', JSON.stringify([...filtered, ...verifiedForThisCompany]));
        } catch (e) {
          // noop
        }
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      // Keep empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setCompanyName(email.split('@')[0]); // Mock company name from email
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (email && password && confirmPassword && companyName && password === confirmPassword) {
      setIsLoggedIn(true);
      setShowSignup(false);
    } else if (password !== confirmPassword) {
      alert('Passwords do not match!');
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('manufacturerUser');
    // Remove this company's golden entries as part of cleanup
    try {
      const existing = JSON.parse(localStorage.getItem('goldenEntries') || '[]');
      const filtered = existing.filter(e => e.companyEmail !== email);
      localStorage.setItem('goldenEntries', JSON.stringify(filtered));
    } catch (e) {
      // noop
    }
    
    // Reset all state
    setIsLoggedIn(false);
    setUserInfo(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
    setShowSignup(false);
    setUploadedData([]);
    
    // Redirect to home page
    router.push('/');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitICData = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        manufacturerName,
        partNumber,
        dateCodeFormat,
        batchCodeFormat,
        logoImage: logoPreview,
        companyEmail: email
      };
      
      if (editingEntry) {
        // Update existing entry
        const response = await fetch('/api/manufacturer/entries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEntry.id, ...payload })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh entries from database
          await fetchEntries();
          alert('Entry updated successfully!');
        } else {
          alert('Failed to update entry: ' + data.error);
        }
        setEditingEntry(null);
      } else {
        // Add new entry
        const response = await fetch('/api/manufacturer/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh entries from database
          await fetchEntries();
          alert('Entry uploaded successfully!');
        } else {
          alert('Failed to upload entry: ' + data.error);
        }
      }
      
      // Reset form
      setManufacturerName('');
      setPartNumber('');
      setLogoImage(null);
      setLogoPreview(null);
      setDateCodeFormat('');
      setBatchCodeFormat('');
      setShowUploadForm(false);
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setManufacturerName(entry.manufacturerName);
    setPartNumber(entry.partNumber);
    setDateCodeFormat(entry.dateCodeFormat);
    setBatchCodeFormat(entry.batchCodeFormat);
    setLogoPreview(entry.logoImage);
    setShowUploadForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/manufacturer/entries?id=${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchEntries();
          alert('Entry deleted successfully!');
        } else {
          alert('Failed to delete entry: ' + data.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowUploadForm(false);
    setEditingEntry(null);
    setManufacturerName('');
    setPartNumber('');
    setLogoImage(null);
    setLogoPreview(null);
    setDateCodeFormat('');
    setBatchCodeFormat('');
  };

  // Bulk upload handlers
  const handleBulkFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBulkFile(file);
      
      // Parse CSV/Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result || '';
        // Normalize Windows/Mac line endings and remove BOM
        const normalized = text.replace(/\uFEFF/g, '').replace(/\r/g, '');
        const rows = normalized.split('\n').slice(1); // Skip header row

        const parsedData = rows
          .map((row) => row.trim())
          .filter((row) => row.length > 0)
          .map((row, index) => {
            const cols = row.split(',').map((cell) => cell.trim());
            if (cols.length < 4) return null;
            const [manufacturer, partNumber, dateFormat, batchFormat] = cols;
            if (!manufacturer || !partNumber || !dateFormat || !batchFormat) return null;
            return {
              id: Date.now() + index,
              manufacturerName: manufacturer,
              partNumber: partNumber,
              dateCodeFormat: dateFormat,
              batchCodeFormat: batchFormat,
              dateUploaded: new Date().toLocaleDateString(),
              status: 'Pending'
            };
          })
          .filter(Boolean);

        setBulkPreview(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkSubmit = async () => {
    if (bulkPreview.length > 0) {
      setSubmitting(true);
      try {
        const response = await fetch('/api/manufacturer/bulk-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entries: bulkPreview,
            companyEmail: email
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchEntries();
          alert(`Successfully uploaded ${data.count} IC entries!`);
          
          // Reset bulk upload
          setBulkFile(null);
          setBulkPreview([]);
          setShowBulkUpload(false);
        } else {
          alert('Failed to upload entries: ' + data.error);
        }
      } catch (error) {
        console.error('Bulk upload error:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const template = 'Manufacturer Name,Part Number,Date Code Format,Batch Code Format\nTexas Instruments,TPS54360DDAR,YYWW,LXXXXXX\nSTMicroelectronics,STM32F103C8T6,YYWWD,BXXXXXX';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ic_bulk_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md">
            <div className="flex justify-center mb-6">
              <Building2 className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">VERITAS Manufacturer Portal</h1>
            <p className="text-blue-200 mb-8">
              Please log in to access your manufacturer dashboard and upload IC verification data to the VERITAS system.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <Lock className="h-5 w-5" />
                Login to Portal
              </Link>
              
              <div className="text-sm text-blue-200">
                New manufacturer?{' '}
                <button 
                  onClick={() => setShowSignup(true)}
                  className="text-white font-medium hover:underline"
                >
                  Register Here
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form if requested
  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Building2 className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="section-title">VERITAS Manufacturer Registration</h1>
            <p className="section-subtitle">
              Register your company for BHEL's VERITAS verification system
            </p>
          </div>

          <div className="card max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
              <p className="text-tech-gray mb-6">
                Submit your company information for BHEL verification and approval.
              </p>
              
              <form className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tech-gray" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="company@domain.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tech-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="Create a secure password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tech-gray hover:text-tech-dark"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your registration will be reviewed by BHEL administrators. 
                    You will receive an email notification once your account is approved.
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Submit Registration
                </button>
              </form>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in view - Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-tech-dark">Manufacturer Dashboard</h1>
            <p className="text-tech-gray mt-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              Welcome back, {companyName || 'Manufacturer'}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        {/* Tally Statistics */}
        <TallyStats 
          className="mb-8"
          stats={[
            {
              icon: Database,
              value: uploadedData.length,
              label: 'IC Entries',
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600',
              valueColor: 'text-blue-600',
              change: 25.3
            },
            {
              icon: CheckCircle,
              value: uploadedData.filter(item => item.status === 'Verified').length,
              label: 'Verified',
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
              valueColor: 'text-green-600',
              change: 12.8
            },
            {
              icon: Upload,
              value: uploadedData.filter(item => item.status === 'Pending').length,
              label: 'Pending',
              bgColor: 'bg-yellow-100',
              iconColor: 'text-yellow-600',
              valueColor: 'text-yellow-600',
              change: 8.5
            },
            {
              icon: Activity,
              value: '98.5%',
              label: 'Success Rate',
              bgColor: 'bg-purple-100',
              iconColor: 'text-purple-600',
              valueColor: 'text-purple-600',
              change: 2.1
            }
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Database className="h-8 w-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold mb-1">{uploadedData.length}</div>
            <div className="text-blue-100">Total IC Entries</div>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CheckCircle className="h-8 w-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold mb-1">{uploadedData.filter(item => item.status === 'Verified').length}</div>
            <div className="text-green-100">Verified</div>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Shield className="h-8 w-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold mb-1">1,234</div>
            <div className="text-purple-100">Verifications Today</div>
          </div>
          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <FileText className="h-8 w-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold mb-1">98.5%</div>
            <div className="text-orange-100">Success Rate</div>
          </div>
        </div>

        {/* Upload Form Modal/Section */}
        {showUploadForm && (
          <div className="card mb-8 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingEntry ? <Edit2 className="h-6 w-6 text-primary-600" /> : <Plus className="h-6 w-6 text-primary-600" />}
                {editingEntry ? 'Edit IC Entry' : 'Add New IC Entry'}
              </h2>
              <button onClick={handleCancelForm} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitICData} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manufacturer Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Manufacturer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={manufacturerName}
                      onChange={(e) => setManufacturerName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="e.g., Texas Instruments"
                      required
                    />
                  </div>
                </div>

                {/* Part Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Part Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={partNumber}
                      onChange={(e) => setPartNumber(e.target.value)}
                      className="input-field pl-10"
                      placeholder="e.g., TPS54360DDAR"
                      required
                    />
                  </div>
                </div>

                {/* Date Code Format */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Date Code Format <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={dateCodeFormat}
                      onChange={(e) => setDateCodeFormat(e.target.value)}
                      className="input-field pl-10"
                      placeholder="e.g., YYWW or YYWWD"
                      required
                    />
                  </div>
                  <p className="text-xs text-tech-gray mt-1">Format: YY=Year, WW=Week, D=Day</p>
                </div>

                {/* Batch Code Format */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Batch Code Format <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={batchCodeFormat}
                      onChange={(e) => setBatchCodeFormat(e.target.value)}
                      className="input-field pl-10"
                      placeholder="e.g., LXXXXXX"
                      required
                    />
                  </div>
                  <p className="text-xs text-tech-gray mt-1">L=Lot, X=Alphanumeric</p>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Logo Image <span className="text-tech-gray font-normal">(Optional)</span>
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="input-field"
                    />
                    <p className="text-xs text-tech-gray mt-1">PNG, JPG, SVG (Max 2MB)</p>
                  </div>
                  {logoPreview && (
                    <div className="w-24 h-24 border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center bg-gray-50">
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </button>
                <button type="button" onClick={handleCancelForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="card mb-8 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-900">
                <FileSpreadsheet className="h-6 w-6" />
                Bulk Upload IC Entries
              </h2>
              <button 
                onClick={() => {
                  setShowBulkUpload(false);
                  setBulkFile(null);
                  setBulkPreview([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Download Template */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Download CSV Template</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Download our template file to format your IC data correctly
                  </p>
                  <button 
                    onClick={handleDownloadTemplate}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleBulkFileUpload}
                className="input-field bg-white"
              />
              <p className="text-xs text-gray-600 mt-1">
                CSV format: Manufacturer Name, Part Number, Date Code Format, Batch Code Format
              </p>
            </div>

            {/* Preview Table */}
            {bulkPreview.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Preview ({bulkPreview.length} entries)
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Manufacturer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Part Number</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date Format</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Batch Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bulkPreview.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.manufacturerName}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{entry.partNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entry.dateCodeFormat}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entry.batchCodeFormat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {bulkPreview.length > 0 && (
              <div className="flex gap-3">
                <button 
                  onClick={handleBulkSubmit}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Upload {bulkPreview.length} Entries
                </button>
                <button 
                  onClick={() => {
                    setBulkFile(null);
                    setBulkPreview([]);
                  }}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Action Buttons */}
          {!showUploadForm && !showBulkUpload && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Single Upload Card */}
              <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl transition-all">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Single Entry Upload</h3>
                    <p className="text-blue-100 text-sm">Add one IC entry at a time with detailed information</p>
                  </div>
                  <button 
                    onClick={() => setShowUploadForm(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    Add Single Entry
                  </button>
                </div>
              </div>

              {/* Bulk Upload Card */}
              <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl transition-all">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bulk Upload</h3>
                    <p className="text-green-100 text-sm">Upload multiple IC entries at once using CSV file</p>
                  </div>
                  <button 
                    onClick={() => setShowBulkUpload(true)}
                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                    Bulk Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back Button when form is open */}
          {(showUploadForm || showBulkUpload) && (
            <button 
              onClick={() => {
                setShowUploadForm(false);
                setShowBulkUpload(false);
                handleCancelForm();
              }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
          )}

          {/* IC Entries Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your IC Entries</h2>
              <span className="text-sm text-tech-gray">{uploadedData.length} entries</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Manufacturer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Part Number</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date Format</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Batch Format</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Uploaded</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uploadedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">{item.manufacturerName}</td>
                      <td className="px-4 py-3 font-mono text-sm font-semibold">{item.partNumber}</td>
                      <td className="px-4 py-3 text-sm text-tech-gray">{item.dateCodeFormat}</td>
                      <td className="px-4 py-3 text-sm text-tech-gray">{item.batchCodeFormat}</td>
                      <td className="px-4 py-3 text-sm text-tech-gray">{item.dateUploaded}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
    </div>
  );
}
