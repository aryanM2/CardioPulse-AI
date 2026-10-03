import axios from 'axios';

// Base Axios instance pointing to FastAPI ML Microservice
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  try {
    const response = await API.get('/api/health');
    return response.data;
  } catch (error) {
    return { status: 'offline', model_loaded: false, detail: 'ML microservice is offline' };
  }
};

export const predictHeartDisease = async (patientData) => {
  try {
    const response = await API.post('/api/predict', patientData);
    return { ...response.data, source: 'FastAPI ML Microservice' };
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to connect to ML microservice';
    console.error('ML Prediction Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

export default API;
