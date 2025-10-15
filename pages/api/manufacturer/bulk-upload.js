// API Route: Bulk Upload IC Entries
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'ic_marking');
    const collection = db.collection('ic_entries');

    const { entries, companyEmail } = req.body || {};

    // Validate entries
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'No entries provided' });
    }

    // Sanitize and validate each entry
    const errors = [];
    const preparedEntries = entries
      .map((entry, idx) => {
        const manufacturerName = typeof entry?.manufacturerName === 'string' ? entry.manufacturerName.trim() : '';
        const partNumberRaw = typeof entry?.partNumber === 'string' ? entry.partNumber.trim() : '';
        const dateCodeFormat = typeof entry?.dateCodeFormat === 'string' ? entry.dateCodeFormat.trim() : '';
        const batchCodeFormat = typeof entry?.batchCodeFormat === 'string' ? entry.batchCodeFormat.trim() : '';

        if (!manufacturerName || !partNumberRaw || !dateCodeFormat || !batchCodeFormat) {
          errors.push({ index: idx, reason: 'Missing required fields' });
          return null;
        }

        return {
          manufacturerName,
          partNumber: partNumberRaw.toUpperCase(),
          dateCodeFormat,
          batchCodeFormat,
          logoImage: entry.logoImage || null,
          companyEmail: companyEmail || 'unknown',
          dateUploaded: new Date(),
          status: 'Verified',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
      .filter(Boolean);

    if (preparedEntries.length === 0) {
      return res.status(400).json({ error: 'No valid entries after validation', details: errors });
    }

    // Insert all entries
    const result = await collection.insertMany(preparedEntries);

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded ${Object.keys(result.insertedIds || {}).length} IC entries`,
      count: Object.keys(result.insertedIds || {}).length,
      insertedIds: result.insertedIds
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to upload IC entries',
      details: error.message 
    });
  }
}
