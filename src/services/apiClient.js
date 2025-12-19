import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://book-my-show-b544.onrender.com/',
  timeout: 10000
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
