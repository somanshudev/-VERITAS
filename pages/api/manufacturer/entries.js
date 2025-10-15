// API Route: Get, Update, Delete IC Entries
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'ic_marking');
    const collection = db.collection('ic_entries');

    // GET: Fetch all entries
    if (req.method === 'GET') {
      const { companyEmail } = req.query;
      
      const query = companyEmail ? { companyEmail } : {};
      const entries = await collection
        .find(query)
        .sort({ dateUploaded: -1 })
        .toArray();

      return res.status(200).json({
        success: true,
        data: entries
      });
    }

    // PUT: Update entry
    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Entry ID required' });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            ...updateData,
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Entry updated successfully'
      });
    }

    // DELETE: Delete entry
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Entry ID required' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Entry deleted successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Database operation failed',
      details: error.message 
    });
  }
}
