import vision from '@google-cloud/vision';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    let client;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      client = new vision.ImageAnnotatorClient({ credentials: creds });
    } else {
      client = new vision.ImageAnnotatorClient();
    }

    const [result] = await client.textDetection({
      image: { content: Buffer.from(imageBase64, 'base64') },
    });

    const fullText = result?.fullTextAnnotation?.text || '';

    // Build lines array from full text, fallback to textAnnotations descriptions
    let lines = [];
    if (fullText) {
      lines = fullText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => ({ text: t, confidence: 90 }));
    } else if (Array.isArray(result?.textAnnotations) && result.textAnnotations.length > 0) {
      // First item is full text, others are words/fragments
      lines = result.textAnnotations
        .slice(1)
        .map((a) => ({ text: a.description.trim(), confidence: 85 }))
        .filter((a) => a.text);
    }

    // Estimate confidence from first page if available
    let confidence = 75;
    try {
      const pages = result?.fullTextAnnotation?.pages || [];
      if (pages.length > 0) {
        let sum = 0;
        let count = 0;
        for (const page of pages) {
          for (const block of page.blocks || []) {
            if (typeof block.confidence === 'number') { sum += block.confidence * 100; count++; }
          }
        }
        if (count > 0) confidence = Math.round(sum / count);
      }
    } catch (_) {}

    return res.status(200).json({
      rawText: fullText,
      confidence,
      lines,
      mimeType: mimeType || null,
    });
  } catch (error) {
    console.error('Vision OCR error:', error);
    return res.status(500).json({
      error: 'VISION_OCR_FAILED',
      message: error.message || 'Failed to extract text with Google Vision',
    });
  }
}
