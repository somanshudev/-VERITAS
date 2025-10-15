import clientPromise from '../../lib/mongodb';

function validateDateCode(dateCode, expectedFormat) {
  if (!dateCode || !expectedFormat) return true;
  if (expectedFormat === 'YYWW') return /^\d{4}$/.test(String(dateCode));
  if (expectedFormat === 'YYWWD') return /^\d{5}$/.test(String(dateCode));
  return true;
}

function validateBatchCode(batchCode, expectedFormat) {
  if (!batchCode || !expectedFormat) return true;
  if (expectedFormat === 'LXXXXXX') return /^L\d{6}$/.test(String(batchCode).toUpperCase());
  if (expectedFormat === 'BXXXXXX') return /^B\d{6}$/.test(String(batchCode).toUpperCase());
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'ic_marking');
    const collection = db.collection('ic_entries');

    const { partNumber, manufacturer, dateCode, batchCode, confidence } = req.body || {};

    if (!partNumber) {
      return res.status(400).json({
        verified: false,
        status: 'error',
        message: 'No part number detected',
      });
    }

    const entry = await collection.findOne({ partNumber: String(partNumber).toUpperCase() });

    if (!entry) {
      return res.status(200).json({
        verified: false,
        status: 'not_found',
        message: `Part number "${partNumber}" not found in database`,
        extractedData: { partNumber, manufacturer, dateCode, batchCode, confidence },
      });
    }

    const manufacturerMatch = !manufacturer || manufacturer === 'Unknown'
      ? true
      : String(entry.manufacturerName).toLowerCase().includes(String(manufacturer).toLowerCase()) ||
        String(manufacturer).toLowerCase().includes(String(entry.manufacturerName).toLowerCase());

    const dateCodeValid = validateDateCode(dateCode, entry.dateCodeFormat);
    const batchCodeValid = validateBatchCode(batchCode, entry.batchCodeFormat);

    let matchScore = 100;
    if (!manufacturerMatch) matchScore -= 30;
    if (!dateCodeValid) matchScore -= 20;
    if (!batchCodeValid) matchScore -= 20;

    let status;
    let message;
    if (matchScore >= 90) {
      status = 'verified';
      message = 'IC marking verified successfully.';
    } else if (matchScore >= 60) {
      status = 'suspicious';
      message = 'Partial match. Some discrepancies detected.';
    } else {
      status = 'fake';
      message = 'Mismatches indicate possible counterfeit.';
    }

    return res.status(200).json({
      verified: status === 'verified',
      status,
      message,
      matchScore,
      details: {
        partNumberMatch: true,
        manufacturerMatch,
        dateCodeValid,
        batchCodeValid,
      },
      extractedData: { partNumber, manufacturer, dateCode, batchCode, confidence },
      databaseData: {
        manufacturerName: entry.manufacturerName,
        partNumber: entry.partNumber,
        dateCodeFormat: entry.dateCodeFormat,
        batchCodeFormat: entry.batchCodeFormat,
      },
    });
  } catch (error) {
    console.error('Verify API error:', error);
    return res.status(500).json({
      verified: false,
      status: 'error',
      message: 'Verification failed',
      error: error.message,
    });
  }
}
