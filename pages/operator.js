import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  BarChart3,
  Clock,
  Zap,
  Settings,
  Activity,
  Target,
  Cpu
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';
import TallyStats from '../components/TallyStats';
import ICFeederAnimation from '../components/ICFeederAnimation';
import AnimatedBackground from '../components/AnimatedBackground';

export default function OperatorInterface() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentPO, setCurrentPO] = useState(null);
  const [scanStats, setScanStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    rate: 0
  });
  const [recentScans, setRecentScans] = useState([]);
  const [machineStatus, setMachineStatus] = useState('ready'); // ready, running, paused, error
  const [isCameraConnected, setIsCameraConnected] = useState(false);
  const [isFeederConnected, setIsFeederConnected] = useState(false);

  // Prototype gating: force one FAIL every 2-3 PASSes
  const passStreakRef = useRef(0);
  const targetPassStreakRef = useRef(2 + Math.floor(Math.random() * 2)); // 2 or 3

  // Mock Purchase Orders
  const availablePOs = [
    {
      id: 'PO-2025-001',
      manufacturer: 'Texas Instruments',
      icType: 'TL074CN',
      quantity: 1000,
      goldenRef: 'Uploaded',
      status: 'ready'
    },
    {
      id: 'PO-2025-002', 
      manufacturer: 'Analog Devices',
      icType: 'AD8066',
      quantity: 500,
      goldenRef: 'Uploaded',
      status: 'ready'
    },
    {
      id: 'PO-2025-003',
      manufacturer: 'Microchip',
      icType: 'PIC16F877A',
      quantity: 750,
      goldenRef: 'Pending',
      status: 'waiting'
    }
  ];

  // Auto-select first ready PO on component mount
  useEffect(() => {
    if (!currentPO) {
      const firstReadyPO = availablePOs.find(po => po.status === 'ready');
      if (firstReadyPO) {
        setCurrentPO(firstReadyPO);
      }
    }
  }, []);

  // Simulated OCR extraction using simple heuristics and golden references
  const performMockOCR = (po, goldenEntries) => {
    const fallbackPart = po?.icType || 'UNKNOWN';
    const fallbackMfr = po?.manufacturer || 'Unknown';
    const forMfr = (goldenEntries || []).filter(e => e.manufacturerName === fallbackMfr);
    // 80% chance OCR returns a known part for the active PO's manufacturer if we have golden data
    const useGolden = forMfr.length > 0 && Math.random() < 0.8;
    const picked = useGolden ? forMfr[Math.floor(Math.random() * forMfr.length)] : null;
    const ocrPartNumber = picked ? picked.partNumber : fallbackPart;
    const ocrManufacturer = picked ? picked.manufacturerName : fallbackMfr;
    // Add some noise: 10% chance of a typo when not using golden
    const noisyPart = !picked && Math.random() < 0.1 && ocrPartNumber.length > 3
      ? ocrPartNumber.slice(0, ocrPartNumber.length - 1) + String.fromCharCode(65 + Math.floor(Math.random()*26))
      : ocrPartNumber;
    return { ocrPartNumber: noisyPart, ocrManufacturer };
  };

  // Simulate scanning process
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      // Load golden references provided by manufacturer portal
      const goldenEntries = JSON.parse(localStorage.getItem('goldenEntries') || '[]');
      const { ocrPartNumber, ocrManufacturer } = performMockOCR(currentPO, goldenEntries);
      // Determine pass/fail using OCR vs current PO and golden entries
      const hasGoldenMatch = goldenEntries.some(e => e.partNumber === ocrPartNumber && e.manufacturerName === ocrManufacturer);
      const matchesPO = (currentPO?.icType === ocrPartNumber) && (currentPO?.manufacturer === ocrManufacturer);
      let isPass = false;
      if (goldenEntries.length > 0) {
        // Prototype mode: keep fail rate low.
        const strictMatch = hasGoldenMatch && matchesPO;
        if (strictMatch) {
          isPass = true;
        } else {
          // Even on mismatch, mostly pass to keep QA queue small
          isPass = Math.random() > 0.1; // ~90% pass
        }
      } else {
        // No golden data: very low fail rate in prototype
        isPass = Math.random() > 0.05; // ~95% pass
      }

      // Enforce review bin frequency: one FAIL every 2-3 PASSes
      if (isPass) {
        if (passStreakRef.current >= targetPassStreakRef.current) {
          // force a FAIL now
          isPass = false;
          passStreakRef.current = 0;
          targetPassStreakRef.current = 2 + Math.floor(Math.random() * 2); // reset to 2 or 3
        } else {
          passStreakRef.current += 1;
        }
      } else {
        // natural fail: reset streak and choose new target
        passStreakRef.current = 0;
        targetPassStreakRef.current = 2 + Math.floor(Math.random() * 2);
      }
      const newScan = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        result: isPass ? 'PASS' : 'FAIL',
        icId: `IC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ocr: {
          manufacturer: ocrManufacturer,
          partNumber: ocrPartNumber
        }
      };

      // If IC failed, add it to QA review queue
      if (!isPass) {
        const failedIC = {
          id: newScan.icId,
          poNumber: currentPO?.id || 'PO-2025-001',
          manufacturer: currentPO?.manufacturer || 'Unknown',
          icType: currentPO?.icType || 'Unknown',
          failureReason: 'Marking verification failed',
          timestamp: new Date().toISOString(),
          status: 'pending',
          priority: Math.random() > 0.6 ? 'high' : 'medium', // Random priority
          goldenRefImage: '/api/placeholder/300/200',
          scannedImage: '/api/placeholder/300/200',
          differences: [
            { type: 'Marking Pattern', severity: 'high', description: 'IC marking does not match golden reference' }
          ]
        };

        // Store in localStorage for QA module to access
        const existingFailedICs = JSON.parse(localStorage.getItem('failedICs') || '[]');
        existingFailedICs.unshift(failedIC);
        localStorage.setItem('failedICs', JSON.stringify(existingFailedICs));
      }

      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
      setScanStats(prev => {
        const newStats = {
          total: prev.total + 1,
          passed: prev.passed + (isPass ? 1 : 0),
          failed: prev.failed + (isPass ? 0 : 1),
          rate: Math.round(60 / 3) // 20 per minute (every 3 seconds)
        };
        
        // Save to localStorage for admin panel
        localStorage.setItem('scanningStats', JSON.stringify(newStats));
        
        return newStats;
      });
    }, 3000); // Slower scanning - every 3 seconds

    return () => clearInterval(interval);
  }, [isScanning]);

  const [startTime] = useState(Date.now());

  const handleStartScanning = () => {
    if (!currentPO) {
      alert('Please select a Purchase Order first');
      return;
    }
    if (!isCameraConnected || !isFeederConnected) {
      alert('Please connect both the Camera and Feeder before starting.');
      return;
    }
    setIsScanning(true);
    setMachineStatus('running');
  };

  const handlePauseScanning = () => {
    setIsScanning(false);
    setMachineStatus('paused');
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    setMachineStatus('ready');
    setScanStats({ total: 0, passed: 0, failed: 0, rate: 0 });
    setRecentScans([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Animated Background */}
      <AnimatedBackground variant="scanning" />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ICChipLogo className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VERITAS Scanning Interface</h1>
                <p className="text-gray-600">Phase 3: Automated IC Inspection</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(machineStatus)}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                Machine {machineStatus.charAt(0).toUpperCase() + machineStatus.slice(1)}
              </div>
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
              icon: Activity,
              value: scanStats.total,
              label: 'Total ICs Scanned',
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600',
              valueColor: 'text-blue-600',
              change: 12.5
            },
            {
              icon: CheckCircle,
              value: scanStats.passed,
              label: 'Passed ICs',
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
              valueColor: 'text-green-600',
              change: 8.3
            },
            {
              icon: XCircle,
              value: scanStats.failed,
              label: 'Failed ICs',
              bgColor: 'bg-red-100',
              iconColor: 'text-red-600',
              valueColor: 'text-red-600',
              change: -2.1
            },
            {
              icon: Zap,
              value: scanStats.rate,
              label: 'Scan Rate (per min)',
              bgColor: 'bg-purple-100',
              iconColor: 'text-purple-600',
              valueColor: 'text-purple-600',
              change: 5.7
            }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Controls */}
          <div className="space-y-6">
            
            {/* PO Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Select Purchase Order
              </h3>
              <div className="space-y-3">
                {availablePOs.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => po.status === 'ready' && setCurrentPO(po)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      currentPO?.id === po.id
                        ? 'border-blue-500 bg-blue-50'
                        : po.status === 'ready'
                        ? 'border-gray-200 hover:border-blue-300'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{po.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        po.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {po.goldenRef}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{po.manufacturer}</p>
                    <p className="text-sm text-gray-500">{po.icType} • {po.quantity} units</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Machine Controls
              </h3>
              <div className="space-y-4">
                {/* Device Connections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsCameraConnected(v => !v)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      isCameraConnected
                        ? 'border-green-300 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Camera className={`h-5 w-5 ${isCameraConnected ? 'text-green-600' : 'text-blue-600'}`} />
                      Camera
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCameraConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isCameraConnected ? 'Connected' : 'Tap to connect'}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsFeederConnected(v => !v)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      isFeederConnected
                        ? 'border-green-300 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Cpu className={`h-5 w-5 ${isFeederConnected ? 'text-green-600' : 'text-blue-600'}`} />
                      Feeder Treadmill
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isFeederConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isFeederConnected ? 'Connected' : 'Tap to connect'}
                    </span>
                  </button>
                </div>

                {/* Connection Instructions */}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  <div className="font-semibold mb-1">Connection Instructions</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Camera: Use USB 3.0 Type‑A cable to connect the camera to the host PC. Prefer blue USB 3.0 port.</li>
                    <li>Feeder Treadmill: Connect control line via GPIO/Relay interface to the controller box. Power the feeder with 24V DC.</li>
                    <li>Optional: Ethernet to camera for configuration if supported; keep USB for video stream.</li>
                    <li>After wiring, tap the buttons above to mark devices as Connected.</li>
                  </ul>
                </div>

                {isCameraConnected && isFeederConnected ? (
                  <button
                    onClick={handleStartScanning}
                    disabled={isScanning || !currentPO}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    Start Scanning
                  </button>
                ) : (
                  <div className="text-xs text-gray-500 text-center">
                    Connect both Camera and Feeder to begin.
                  </div>
                )}
                <button
                  onClick={handlePauseScanning}
                  disabled={!isScanning}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Pause className="h-5 w-5" />
                  Pause Scanning
                </button>
                <button
                  onClick={handleStopScanning}
                  disabled={machineStatus === 'ready'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Square className="h-5 w-5" />
                  Stop & Reset
                </button>
              </div>
            </div>

            {/* Current Job Info */}
            {currentPO && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Job</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PO Number:</span>
                    <span className="font-medium">{currentPO.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="font-medium">{currentPO.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IC Type:</span>
                    <span className="font-medium">{currentPO.icType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Qty:</span>
                    <span className="font-medium">{currentPO.quantity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Camera Feed & Stats */}
          <div className="space-y-6">
            
            {/* IC Feeder Animation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                IC Feeder System
              </h3>
              <ICFeederAnimation isActive={isScanning} />
            </div>

            {/* Camera Feed Simulation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Live Camera Feed
              </h3>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="relative w-full h-full">
                    {/* Simulated IC scanning */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ICChipLogo className="h-20 w-20 text-white animate-pulse" />
                    </div>
                    {/* Scanning overlay */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-400 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-green-400 animate-pulse delay-500"></div>
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-400 animate-pulse delay-1000"></div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-green-400 animate-pulse delay-1500"></div>
                    </div>
                    {/* Status overlay */}
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                      SCANNING...
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Camera feed will appear here when scanning starts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{scanStats.passed}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Passed ICs
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-red-600">{scanStats.failed}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <XCircle className="h-4 w-4" />
                  Failed ICs
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{scanStats.total}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Total ICs Scanned
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{scanStats.rate}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4" />
                  Scan Rate (per min)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Scans */}
          <div className="space-y-6">
            
            {/* Recent Scan Results */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Scans
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentScans.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scans yet. Start scanning to see results.</p>
                ) : (
                  recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        scan.result === 'PASS'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{scan.icId}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          scan.result === 'PASS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {scan.result}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{scan.timestamp}</span>
                        <span>ID: {scan.icId}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bin Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sorting Bins</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">PASS Bin</span>
                  </div>
                  <span className="text-green-600 font-bold">{scanStats.passed}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-800">QA Review Bin</span>
                  </div>
                  <span className="text-red-600 font-bold">{scanStats.failed}</span>
                </div>
              </div>
              
              {scanStats.failed > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {scanStats.failed} ICs require QA review
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
