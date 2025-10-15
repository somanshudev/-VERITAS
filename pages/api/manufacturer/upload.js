// API Route: Upload Single IC Entry
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'ic_marking');
    const collection = db.collection('ic_entries');

    const { manufacturerName, partNumber, dateCodeFormat, batchCodeFormat, logoImage, companyEmail } = req.body;

    // Validate required fields
    if (!manufacturerName || !partNumber || !dateCodeFormat || !batchCodeFormat) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new entry
    const newEntry = {
      manufacturerName,
      partNumber: partNumber.toUpperCase(),
      dateCodeFormat,
      batchCodeFormat,
      logoImage: logoImage || null,
      companyEmail: companyEmail || 'unknown',
      dateUploaded: new Date(),
      status: 'Verified',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await collection.insertOne(newEntry);

    return res.status(201).json({
      success: true,
      message: 'IC entry uploaded successfully',
      data: {
        id: result.insertedId,
        ...newEntry
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to upload IC entry',
      details: error.message 
    });
  }
}
