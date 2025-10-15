// API Route: POST /api/datasheet/extract
// Payload: { datasheetUrl: string }
// Response: { text: string, pageCount?: number, length: number, info?: object }

const axios = require('axios');
const pdfParse = require('pdf-parse');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: false,
  },
};

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { datasheetUrl } = req.body || {};

  if (!datasheetUrl || typeof datasheetUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid request: "datasheetUrl" (string) is required in JSON body.' });
  }

  if (!isValidHttpUrl(datasheetUrl)) {
    return res.status(400).json({ error: 'Invalid "datasheetUrl": must be a valid http/https URL.' });
  }

  try {
    const response = await axios.get(datasheetUrl, {
      responseType: 'arraybuffer',
      timeout: 20000,
      maxContentLength: 25 * 1024 * 1024, // 25MB
      headers: {
        Accept: 'application/pdf, application/octet-stream',
        'User-Agent': 'IC-Mark-Extractor/1.0 (+https://localhost)'
      }
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('pdf') && !datasheetUrl.toLowerCase().endsWith('.pdf')) {
      return res.status(415).json({ error: 'The provided URL does not appear to be a PDF (unsupported media type).', contentType });
    }

    const pdfBuffer = Buffer.from(response.data);

    const result = await pdfParse(pdfBuffer);
    const text = result.text || '';

    return res.status(200).json({
      text,
      length: text.length,
      pageCount: result.numpages,
      info: result.info || null,
    });
  } catch (err) {
    // Axios errors
    if (err.isAxiosError) {
      const status = err.response?.status;
      const statusText = err.response?.statusText;
      return res.status(502).json({
        error: 'Failed to fetch PDF from the provided URL.',
        details: status ? `${status} ${statusText || ''}`.trim() : err.message,
      });
    }

    // pdf-parse or generic errors
    return res.status(500).json({
      error: 'Failed to extract text from PDF.',
      details: err?.message || 'Unknown error',
    });
  }
}
