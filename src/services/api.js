// src/services/api.js
import axios from 'axios';
//  
//const API_BASE_URL =import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; 
const API_BASE_URL = 'https://backend-production-4a23.up.railway.app/api';

// 🆕 Create a completely clean instance for public, non-protected endpoints
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  // No interceptors are added to publicApi
});



// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  /*
  headers: {
    'Content-Type': 'application/json'
  }
  */
});
