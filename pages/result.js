import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, XCircle, Download, FileText, ArrowLeft, Database } from 'lucide-react';

export default function Result() {
  const router = useRouter();
  const { status } = router.query;
  const [verificationResult, setVerificationResult] = useState(null);

  // Load verification result from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem('verificationResult');
    if (storedResult) {
      setVerificationResult(JSON.parse(storedResult));
    }
  }, []);

  // Mock uploaded image (in real app, this would come from upload)
  const uploadedImage = '/api/placeholder-ic-image.jpg';

  // Mock verification data with database comparison
  const verificationData = {
    genuine: {
      status: 'Genuine',
      statusIcon: CheckCircle,
      statusColor: 'green',
      confidence: 98.5,
      similarity: 97.8,
      message: 'All extracted markings match verified database records',
      extractedData: [
        { 
          field: 'Manufacturer', 
          extracted: 'Texas Instruments', 
          database: 'Texas Instruments',
          match: true 
        },
        { 
          field: 'Part Number', 
          extracted: 'TPS54360DDAR', 
          database: 'TPS54360DDAR',
          match: true 
        },
        { 
          field: 'Batch Code', 
          extracted: 'L2342A5', 
          database: 'L2342A5',
          match: true 
        },
        { 
          field: 'Date Code', 
          extracted: '2023-W42', 
          database: '2023-W42',
          match: true 
        },
      ],
    },
    suspicious: {
      status: 'Possible Counterfeit',
      statusIcon: AlertTriangle,
      statusColor: 'yellow',
      confidence: 62.3,
      similarity: 58.4,
      message: 'Some extracted markings do not match verified database records',
      extractedData: [
        { 
          field: 'Manufacturer', 
          extracted: 'Texas Instruments', 
          database: 'Texas Instruments',
          match: true 
        },
        { 
          field: 'Part Number', 
          extracted: 'TPS54360DDAR', 
          database: 'TPS54360DDAR',
          match: true 
        },
        { 
          field: 'Batch Code', 
          extracted: 'L9999X1', 
          database: 'Not Found',
          match: false 
        },
        { 
          field: 'Date Code', 
          extracted: '2025-W99', 
          database: 'Invalid Format',
          match: false 
        },
      ],
    },
    fake: {
      status: 'Fake',
      statusIcon: XCircle,
      statusColor: 'red',
      confidence: 15.2,
      similarity: 22.1,
      message: 'Critical mismatches detected - IC marking appears counterfeit',
      extractedData: [
        { 
          field: 'Manufacturer', 
          extracted: 'Texes Instrumants', 
          database: 'Texas Instruments',
          match: false 
        },
        { 
          field: 'Part Number', 
          extracted: 'TPS54360DDXR', 
          database: 'TPS54360DDAR',
          match: false 
        },
        { 
          field: 'Batch Code', 
          extracted: 'Unknown', 
          database: 'Not Found',
          match: false 
        },
        { 
          field: 'Date Code', 
          extracted: 'Illegible', 
          database: 'Not Found',
          match: false 
        },
      ],
    },
  };

  // Determine which result to show
  let currentResult;
  if (status === 'genuine' || status === 'verified') {
    currentResult = verificationData.genuine;
  } else if (status === 'fake') {
    currentResult = verificationData.fake;
  } else {
    currentResult = verificationData.suspicious;
  }

  const StatusIcon = currentResult.statusIcon;

  // Calculate match statistics
  const totalFields = currentResult.extractedData.length;
  const matchedFields = currentResult.extractedData.filter(item => item.match).length;
  const mismatchedFields = totalFields - matchedFields;

  const handleDownloadReport = () => {
    alert('PDF report download would start here. In production, this would generate and download a PDF report.');
  };

  return (
    <div className="min-h-screen bg-tech-light py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/verify" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          Verify Another IC
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-3">Verification Results</h1>
          <p className="text-lg text-tech-gray">
            Comprehensive analysis and database comparison
          </p>
        </div>

        {/* Final Status Card */}
        <div className={`card mb-8 border-l-8 ${
          currentResult.statusColor === 'green' ? 'border-green-500 bg-green-50' :
          currentResult.statusColor === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
          'border-red-500 bg-red-50'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                currentResult.statusColor === 'green' ? 'bg-green-100' :
                currentResult.statusColor === 'yellow' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <StatusIcon className={`h-12 w-12 ${
                  currentResult.statusColor === 'green' ? 'text-green-600' :
                  currentResult.statusColor === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {currentResult.status === 'Genuine' && <span className="text-3xl">✅</span>}
                  {currentResult.status === 'Possible Counterfeit' && <span className="text-3xl">⚠️</span>}
                  {currentResult.status === 'Fake' && <span className="text-3xl">❌</span>}
                  <h2 className={`text-3xl font-bold ${
                    currentResult.statusColor === 'green' ? 'text-green-700' :
                    currentResult.statusColor === 'yellow' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {currentResult.status}
                  </h2>
                </div>
                <p className="text-tech-gray text-lg">
                  {currentResult.message}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  currentResult.statusColor === 'green' ? 'text-green-600' :
                  currentResult.statusColor === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {currentResult.confidence}%
                </div>
                <div className="text-sm text-tech-gray mt-1">Confidence</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  currentResult.statusColor === 'green' ? 'text-green-600' :
                  currentResult.statusColor === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {currentResult.similarity}%
                </div>
                <div className="text-sm text-tech-gray mt-1">Similarity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Uploaded IC Image */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Uploaded IC Image</h3>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-64">
                <div className="text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">IC Image Preview</p>
                  <p className="text-xs mt-1">(In production, actual uploaded image would display here)</p>
                </div>
              </div>
            </div>

            {/* Extracted Marking Details - Comparison Table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary-600" />
                  Extracted Marking Details
                </h3>
                <div className="text-sm">
                  <span className="text-green-600 font-semibold">{matchedFields} Matched</span>
                  {mismatchedFields > 0 && (
                    <span className="text-red-600 font-semibold ml-2">{mismatchedFields} Mismatched</span>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-tech-dark">Field</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-tech-dark">Extracted Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-tech-dark">Database Value</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-tech-dark">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentResult.extractedData.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`${
                          item.match 
                            ? 'bg-green-50 hover:bg-green-100' 
                            : 'bg-red-50 hover:bg-red-100'
                        } transition-colors`}
                      >
                        <td className="px-4 py-4 font-semibold text-tech-dark">
                          {item.field}
                        </td>
                        <td className={`px-4 py-4 font-mono text-sm ${
                          item.match ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {item.extracted}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm text-tech-gray">
                          {item.database}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.match ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              <CheckCircle className="h-4 w-4" />
                              Match
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                              <XCircle className="h-4 w-4" />
                              Mismatch
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Database Source Info */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Database Source:</strong> Verified against public datasets including Octopart, manufacturer databases, and industry standards.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Report */}
            <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
              <h3 className="text-lg font-semibold mb-3">Download Report</h3>
              <p className="text-sm text-primary-100 mb-4">
                Get a detailed PDF report with all verification results
              </p>
              <button 
                onClick={handleDownloadReport}
                className="w-full bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download PDF Report
              </button>
            </div>

            {/* Match Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Match Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-700">Matched Fields</span>
                  <span className="text-2xl font-bold text-green-600">{matchedFields}</span>
                </div>
                {mismatchedFields > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-700">Mismatched Fields</span>
                    <span className="text-2xl font-bold text-red-600">{mismatchedFields}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-tech-dark">Total Fields</span>
                  <span className="text-2xl font-bold text-tech-dark">{totalFields}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className={`card border-2 ${
              currentResult.statusColor === 'green' ? 'bg-green-50 border-green-200' :
              currentResult.statusColor === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <h3 className="text-lg font-semibold mb-3">
                Recommendations
              </h3>
              {currentResult.statusColor === 'green' ? (
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>This IC appears authentic and safe to use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Store verification report for records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Continue with normal procurement process</span>
                  </li>
                </ul>
              ) : currentResult.statusColor === 'yellow' ? (
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Exercise caution - some fields do not match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Contact supplier for verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Consult with quality assurance team</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-red-800">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Do NOT use this IC in production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Report to supplier immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Quarantine and investigate source</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Verification Info */}
            <div className="card bg-gray-50">
              <h3 className="text-sm font-semibold mb-3 text-tech-gray">
                Verification Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-tech-gray">Date:</span>
                  <span className="font-medium">Oct 11, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tech-gray">Time:</span>
                  <span className="font-medium">2:13 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tech-gray">Report ID:</span>
                  <span className="font-medium font-mono text-xs">VRF-2025-1011</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tech-gray">Method:</span>
                  <span className="font-medium">AI + Database</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
