// OCR Verification Library with Database Checking

// Mock manufacturer database (in production, this would be from your backend)
const manufacturerDatabase = [
  // Texas Instruments
  { manufacturer: 'Texas Instruments', partNumber: 'TPS54360DDAR', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'Texas Instruments', partNumber: 'LM358DR', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'Texas Instruments', partNumber: 'TPS54620RHLR', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'Texas Instruments', partNumber: 'LM2596S-5.0', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  
  // STMicroelectronics
  { manufacturer: 'STMicroelectronics', partNumber: 'STM32F103C8T6', dateFormat: 'YYWWD', batchFormat: 'BXXXXXX' },
  { manufacturer: 'STMicroelectronics', partNumber: 'L7805CV', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'STMicroelectronics', partNumber: 'STM32F407VGT6', dateFormat: 'YYWWD', batchFormat: 'BXXXXXX' },
  
  // NXP Semiconductors
  { manufacturer: 'NXP Semiconductors', partNumber: 'LPC1768FBD100', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'NXP Semiconductors', partNumber: 'TJA1050T', dateFormat: 'YYWWD', batchFormat: 'BXXXXXX' },
  { manufacturer: 'NXP Semiconductors', partNumber: 'PCF8574T', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  
  // Analog Devices
  { manufacturer: 'Analog Devices', partNumber: 'AD8232ACPZ', dateFormat: 'YYWW', batchFormat: 'BXXXXXX' },
  { manufacturer: 'Analog Devices', partNumber: 'AD620ANZ', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  
  // Microchip Technology
  { manufacturer: 'Microchip Technology', partNumber: 'ATmega328P-PU', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
  { manufacturer: 'Microchip Technology', partNumber: 'PIC16F877A-I/P', dateFormat: 'YYWWD', batchFormat: 'BXXXXXX' },
  { manufacturer: 'Microchip Technology', partNumber: 'ATTINY85-20PU', dateFormat: 'YYWW', batchFormat: 'LXXXXXX' },
];

/**
 * Simulate OCR text extraction from image
 * In production, this would use Tesseract.js or Google Vision API
 */
export const extractTextFromImage = async (imageFile) => {
  return new Promise(async (resolve, reject) => {
    // Validate image file
    if (!imageFile || !imageFile.type?.startsWith('image/')) {
      reject({
        error: 'INVALID_FILE',
        message: 'Please upload a valid image file (JPG, PNG, or BMP)'
      });
      return;
    }

    // Check file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      reject({
        error: 'FILE_TOO_LARGE',
        message: 'Image file is too large. Please upload an image smaller than 10MB'
      });
      return;
    }

    try {
      // Read file as base64
      const dataUrl = await readFileAsDataURL(imageFile);
      const base64 = String(dataUrl).split(',')[1];

      // Call backend OCR (Google Vision)
      const resp = await fetch('/api/ocr/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: imageFile.type })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'OCR request failed');
      }

      const ocr = await resp.json();
      resolve(ocr);
    } catch (e) {
      reject({
        error: 'OCR_FAILED',
        message: e.message || 'Failed to process image'
      });
    }
  });
};

/**
 * Simulate OCR text extraction (for demo purposes)
 * In production, replace with actual OCR library
 */
const simulateOCRExtraction = (fileName) => {
  // For demo, return different results based on filename patterns
  // In production, this would be actual OCR results
  
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('tps') || lowerName.includes('ti')) {
    return {
      rawText: 'TPS54360DDAR\nTI\n2347\nL234567',
      confidence: 92.5,
      lines: [
        { text: 'TPS54360DDAR', confidence: 95 },
        { text: 'TI', confidence: 98 },
        { text: '2347', confidence: 90 },
        { text: 'L234567', confidence: 88 }
      ]
    };
  } else if (lowerName.includes('stm') || lowerName.includes('st')) {
    return {
      rawText: 'STM32F103C8T6\nST\n23471\nB123456',
      confidence: 89.3,
      lines: [
        { text: 'STM32F103C8T6', confidence: 92 },
        { text: 'ST', confidence: 96 },
        { text: '23471', confidence: 87 },
        { text: 'B123456', confidence: 85 }
      ]
    };
  } else if (lowerName.includes('nxp') || lowerName.includes('lpc')) {
    return {
      rawText: 'LPC1768FBD100\nNXP\n2348\nL345678',
      confidence: 91.2,
      lines: [
        { text: 'LPC1768FBD100', confidence: 94 },
        { text: 'NXP', confidence: 97 },
        { text: '2348', confidence: 89 },
        { text: 'L345678', confidence: 87 }
      ]
    };
  } else {
    // Default: unknown image → low confidence and no readable lines
    // This ensures the verification flow does NOT falsely accept random images.
    return {
      rawText: '',
      confidence: 30.0,
      lines: []
    };
  }
};

/**
 * Parse extracted text to identify IC components
 */
export const parseICMarking = (ocrResult) => {
  if (!ocrResult || !ocrResult.lines || ocrResult.lines.length === 0) {
    return {
      success: false,
      error: 'NO_TEXT_DETECTED',
      message: 'No text detected in the image. Please ensure the IC marking is clearly visible'
    };
  }

  // Check confidence threshold (lowered to 40 for more flexibility)
  if (ocrResult.confidence < 40) {
    return {
      success: false,
      error: 'LOW_CONFIDENCE',
      message: 'Image quality is too low. Please upload a clearer image with better lighting'
    };
  }

  const lines = ocrResult.lines.map(line => line.text);
  
  // Extract components
  const partNumber = extractPartNumber(lines);
  const manufacturer = extractManufacturer(lines);
  const dateCode = extractDateCode(lines);
  const batchCode = extractBatchCode(lines);

  if (!partNumber) {
    return {
      success: false,
      error: 'NO_PART_NUMBER',
      message: 'Could not detect IC part number. Please ensure the part number is clearly visible'
    };
  }

  return {
    success: true,
    data: {
      partNumber,
      manufacturer,
      dateCode,
      batchCode,
      confidence: ocrResult.confidence
    }
  };
};

/**
 * Extract part number from OCR lines
 */
const extractPartNumber = (lines) => {
  // Part numbers are typically alphanumeric, 6-20 characters
  const partNumberPattern = /^[A-Z0-9]{6,20}[-]?[A-Z0-9]{0,10}$/;
  
  for (const line of lines) {
    const cleaned = line.trim().toUpperCase();
    if (partNumberPattern.test(cleaned)) {
      return cleaned;
    }
  }
  
  return null;
};

/**
 * Extract manufacturer from OCR lines
 */
const extractManufacturer = (lines) => {
  const manufacturers = {
    'TI': 'Texas Instruments',
    'ST': 'STMicroelectronics',
    'NXP': 'NXP Semiconductors',
    'ADI': 'Analog Devices',
    'MCHP': 'Microchip Technology',
    'ATMEL': 'Microchip Technology'
  };
  
  for (const line of lines) {
    const cleaned = line.trim().toUpperCase();
    if (manufacturers[cleaned]) {
      return manufacturers[cleaned];
    }
  }
  
  return 'Unknown';
};

/**
 * Extract date code from OCR lines
 */
const extractDateCode = (lines) => {
  // Date codes: YYWW (2347) or YYWWD (23471)
  const datePattern = /^\d{4,5}$/;
  
  for (const line of lines) {
    const cleaned = line.trim();
    if (datePattern.test(cleaned)) {
      return cleaned;
    }
  }
  
  return null;
};

/**
 * Extract batch/lot code from OCR lines
 */
const extractBatchCode = (lines) => {
  // Batch codes: L followed by numbers (L234567) or B followed by numbers
  const batchPattern = /^[LB]\d{5,7}$/;
  
  for (const line of lines) {
    const cleaned = line.trim().toUpperCase();
    if (batchPattern.test(cleaned)) {
      return cleaned;
    }
  }
  
  return null;
};

/**
 * Verify IC against manufacturer database
 */
export const verifyAgainstDatabase = (parsedData) => {
  if (!parsedData || !parsedData.success) {
    return {
      verified: false,
      status: 'error',
      message: parsedData?.message || 'Invalid data'
    };
  }

  const { partNumber, manufacturer, dateCode, batchCode, confidence } = parsedData.data;

  // Call backend verification against MongoDB
  return fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partNumber, manufacturer, dateCode, batchCode, confidence })
  }).then(async (r) => {
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return Promise.reject({
        verified: false,
        status: 'error',
        message: err.message || 'Verification request failed'
      });
    }
    return r.json();
  });
};

/**
 * Validate date code format
 */
const validateDateCode = (dateCode, expectedFormat) => {
  if (expectedFormat === 'YYWW') {
    return /^\d{4}$/.test(dateCode);
  } else if (expectedFormat === 'YYWWD') {
    return /^\d{5}$/.test(dateCode);
  }
  return true;
};

/**
 * Validate batch code format
 */
const validateBatchCode = (batchCode, expectedFormat) => {
  if (expectedFormat === 'LXXXXXX') {
    return /^L\d{6}$/.test(batchCode);
  } else if (expectedFormat === 'BXXXXXX') {
    return /^B\d{6}$/.test(batchCode);
  }
  return true;
};

/**
 * Main verification function
 */
export const verifyICImage = async (imageFile, providedPartNumber) => {
  try {
    // Step 1: Extract text from image
    const ocrResult = await extractTextFromImage(imageFile);
    
    // Step 2: Parse IC marking
    const parsedData = parseICMarking(ocrResult);
    // If user provided a part number, prefer it (uppercase) for verification
    if (parsedData?.success && providedPartNumber) {
      parsedData.data.partNumber = String(providedPartNumber).toUpperCase();
    }
    
    // Step 3: Verify against database
    const verificationResult = await verifyAgainstDatabase(parsedData);
    
    return verificationResult;
  } catch (error) {
    return {
      verified: false,
      status: 'error',
      message: error.message || 'An error occurred during verification',
      error: error.error || 'UNKNOWN_ERROR'
    };
  }
};

// Helper: read file as data URL
const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Failed to read file'));
  reader.readAsDataURL(file);
});
