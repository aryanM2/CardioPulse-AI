
const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

// Docker service name for FastAPI
const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const mlRes = await fetch(
      `${ML_SERVICE_URL}/api/health`
    );

    if (!mlRes.ok) {
      throw new Error(`ML service returned ${mlRes.status}`);
    }

    const data = await mlRes.json();

    res.json({
      status: 'online',
      server: 'Express Bridge',
      mlService: data
    });

  } catch (e) {
    console.error('ML health check failed:', e.message);

    res.status(503).json({
      status: 'offline',
      server: 'Express Bridge',
      error: 'Python ML Microservice is unreachable'
    });
  }
});

// Prediction route
app.post('/api/predict', async (req, res) => {
  try {
    const mlRes = await fetch(
      `${ML_SERVICE_URL}/api/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await mlRes.json();

    if (!mlRes.ok) {
      return res.status(mlRes.status).json(data);
    }

    res.json(data);

  } catch (err) {
    console.error('ML Service Error:', err.message);

    res.status(503).json({
      error: 'ML Service Unavailable',
      detail: 'Could not connect to Python ML microservice.'
    });
  }
});

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`ML Service URL: ${ML_SERVICE_URL}`);
});