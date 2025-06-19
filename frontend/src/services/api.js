import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

export const processImage = async (imageData) => {
  const response = await axios.post(`${API_BASE_URL}/recognize`, {
    image: imageData.split(',')[1] // Remove data URL prefix
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};