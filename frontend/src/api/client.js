import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export const api = {
  getCities: () => client.get('/cities'),
  getOpportunities: (city_id, type) => 
    client.get(`/opportunities?city_id=${city_id}&business_type=${type}`),
  getTrends: (city_id, type) => 
    client.get(`/trends?city_id=${city_id}&business_type=${type}`),
  getStats: () => client.get('/stats'),
  getPrediction: (city_id, type) => 
    client.get(`/predict?city_id=${city_id}&business_type=${type}`),
  getHotspots: (city_id) => client.get(`/hotspots?city_id=${city_id}`),
  resolveCity: (name) => client.get(`/resolve-city?name=${encodeURIComponent(name)}`),
  getOpportunityAnalysis: (city_id) => client.get(`/api/opportunity-analysis?city_id=${city_id}`),
};
