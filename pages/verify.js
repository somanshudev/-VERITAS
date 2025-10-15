import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Upload, Camera, FileImage, X, Loader2, CheckCircle, Info, Zap, Database, Search, AlertCircle } from 'lucide-react';
import { verifyICImage } from '../lib/ocr-verification';

export default function Verify() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationStage, setVerificationStage] = useState('');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [partNumber, setPartNumber] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Verification stages with icons
  const verificationStages = [
    { id: 1, name: 'Uploading Image', icon: Upload, duration: 800 },
    { id: 2, name: 'AI-Powered OCR Processing', icon: Zap, duration: 2500 },
    { id: 3, name: 'Extracting IC Markings', icon: Search, duration: 1200 },
    { id: 4, name: 'Verifying with Database', icon: Database, duration: 1800 },
    { id: 5, name: 'Generating Report', icon: CheckCircle, duration: 700 }
  ];

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleCameraCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setPartNumber('');
    setUploadProgress(0);
  };

  const handleVerify = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadProgress(0);
    setCurrentStageIndex(0);
    setError(null);
    
    try {
      // Process through each verification stage
      for (let i = 0; i < verificationStages.length; i++) {
        const stage = verificationStages[i];
        setVerificationStage(stage.name);
        setCurrentStageIndex(i);
        
        // Simulate progress within each stage
        const stepProgress = 100 / verificationStages.length;
        const startProgress = i * stepProgress;
        
        // Smooth progress animation
        const progressSteps = 20;
        for (let p = 0; p <= progressSteps; p++) {
          setUploadProgress(Math.min(startProgress + (p * stepProgress / progressSteps), 100));
          await new Promise(resolve => setTimeout(resolve, stage.duration / progressSteps));
        }
        
        // Perform actual verification at stage 2 (OCR Processing)
        if (i === 1) {
          const result = await verifyICImage(selectedFile, partNumber);
          
          // Store result in sessionStorage for result page
          sessionStorage.setItem('verificationResult', JSON.stringify(result));
          
          // Check for errors
          if (!result.verified) {
            setError(result.message);
            setUploading(false);
            return;
          }
        }
      }
      
      // Redirect to results after completion
      setTimeout(() => {
        const storedResult = JSON.parse(sessionStorage.getItem('verificationResult'));
        router.push(`/result?status=${storedResult.status}`);
      }, 300);
    } catch (err) {
      setError(err.message || 'An error occurred during verification');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-light py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-3">Upload / Scan IC</h1>
          <p className="text-lg text-tech-gray">
            Upload an image or capture via camera for instant verification
          </p>
        </div>

        {/* Hint Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Use clear images for best results. Ensure good lighting and sharp focus.
            </p>
          </div>
        </div>

        {/* Upload Card */}
        <div className="card">
          {!preview ? (
            <>
              {/* Drag and Drop Area */}
              <div
                className={`border-3 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Upload className="h-10 w-10 text-primary-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-tech-dark">
                    Drag & Drop Image Here
                  </h3>
                  <p className="text-tech-gray mb-6">
                    or choose from the options below
                  </p>
                  
                  {/* Upload Options */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary flex-1"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FileImage className="h-5 w-5" />
                        Choose File
                      </span>
                    </button>
                    
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="btn-secondary flex-1"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Camera className="h-5 w-5" />
                        Capture Photo
                      </span>
                    </button>
                  </div>
                  
                  {/* Hidden Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                  />
                  
                  <p className="text-xs text-tech-gray mt-4">
                    Supported: JPG, PNG, WEBP • Max 10MB
                  </p>
                </div>
              </div>

              {/* Optional Part Number Input */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-tech-dark mb-2">
                  IC Part Number <span className="text-tech-gray font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g., TPS54360DDAR"
                  className="input-field"
                />
                <p className="text-xs text-tech-gray mt-1">
                  Providing the part number can improve verification accuracy
                </p>
              </div>
            </>
          ) : (
            <div>
              {/* Image Preview */}
              <div className="relative mb-6">
                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all hover:scale-110 z-10 shadow-lg"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={preview}
                  alt="IC Preview"
                  className="w-full max-h-96 object-contain bg-gray-100 rounded-lg border-2 border-gray-200"
                />
              </div>
              
              {/* File Info */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileImage className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-tech-dark">{selectedFile?.name}</p>
                      <p className="text-sm text-tech-gray">
                        {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900 mb-1">Verification Failed</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Part Number Input (when image is uploaded) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-tech-dark mb-2">
                  IC Part Number <span className="text-tech-gray font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g., TPS54360DDAR"
                  className="input-field"
                  disabled={uploading}
                />
              </div>
              
              {/* Upload Button with Progress */}
              {!uploading ? (
                <button
                  onClick={handleVerify}
                  className="btn-primary w-full text-lg py-4"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="h-6 w-6" />
                    Upload & Verify
                  </span>
                </button>
              ) : (
                <div className="space-y-6">
                  {/* Current Stage Display */}
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border-2 border-primary-200">
                    <div className="flex items-center gap-3">
                      {verificationStages[currentStageIndex] && (
                        <>
                          {(() => {
                            const StageIcon = verificationStages[currentStageIndex].icon;
                            return <StageIcon className="h-6 w-6 text-primary-600 animate-pulse" />;
                          })()}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-tech-dark">
                              {verificationStage}
                            </p>
                            <p className="text-xs text-tech-gray mt-0.5">
                              Step {currentStageIndex + 1} of {verificationStages.length}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-primary-600">
                            {Math.round(uploadProgress)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 h-4 rounded-full transition-all duration-300 ease-out relative"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stage Indicators */}
                  <div className="flex justify-between items-start gap-2">
                    {verificationStages.map((stage, index) => {
                      const isCompleted = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;
                      const StageIcon = stage.icon;
                      
                      return (
                        <div key={stage.id} className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? 'bg-green-500 text-white scale-100'
                              : isCurrent
                              ? 'bg-primary-600 text-white scale-110 shadow-lg'
                              : 'bg-gray-200 text-gray-400 scale-90'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <StageIcon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                            )}
                          </div>
                          <span className={`text-xs text-center mt-2 max-w-[70px] transition-all duration-300 ${
                            isCurrent ? 'font-semibold text-primary-600' : 'text-tech-gray'
                          }`}>
                            {stage.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Processing Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">AI-Powered Verification</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Using advanced OCR and cross-referencing with Octopart database for accurate results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hints Section */}
        {!preview && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-tech-dark mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary-600" />
              Tips for Best Results
            </h3>
            <ul className="space-y-2 text-sm text-tech-gray">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensure the IC marking is clearly visible and in focus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use good lighting - avoid shadows and glare</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Capture the entire IC chip in the frame</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use high-resolution images for better accuracy</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
