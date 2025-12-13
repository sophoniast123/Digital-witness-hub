// Vercel Serverless Function to proxy uClassify API requests
// This avoids CORS issues by making the API call from the server

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, classifier } = req.body;

  // Validate input
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
  }

  if (!classifier || typeof classifier !== 'string') {
    return res.status(400).json({ error: 'Classifier is required' });
  }

  // Get API key from environment variable
  const apiKey = process.env.VITE_UCLASSIFY_API_KEY || '46uamncjLZ0G';
  const apiUrl = `https://api.uclassify.com/v1/uclassify/${classifier}/classify`;

  try {
    // Make request to uClassify API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('uClassify API Error:', data);
      return res.status(response.status).json({
        error: 'uClassify API request failed',
        details: data
      });
    }

    // Return the result
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({
      error: 'Failed to connect to uClassify API',
      message: error.message
    });
  }
}
