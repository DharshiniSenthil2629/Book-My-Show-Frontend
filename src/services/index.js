import apiClient from './apiClient';

export const authService = {
  signup: (userData) => apiClient.post('/auth/signup', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const movieService = {
  getAllMovies: (page = 1, limit = 100) => 
    apiClient.get(`/movies?page=${page}&limit=${limit}`),
  getMovieById: (id) => apiClient.get(`/movies/${id}`),
  searchMovies: (query, language, category) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (language) params.append('language', language);
    if (category) params.append('category', category);
    return apiClient.get(`/movies/search/query?${params.toString()}`);
  }
  ,
  getFilters: () => apiClient.get('/movies/filters')
};

export const theatreService = {
  getTheatresByCity: (city) => apiClient.get(`/theatres/${city}`),
  getTheatreDetails: (id) => apiClient.get(`/theatres/detail/${id}`)
};

export const bookingService = {
  lockSeats: (showId, seatIds) => 
    apiClient.post('/bookings/lock-seats', { showId, seatIds }),
  getAvailableSeats: (showId) => apiClient.get(`/bookings/seats/${showId}`),
  confirmBooking: (showId, seatIds, amount) => 
    apiClient.post('/bookings/confirm', { showId, seatIds, amount }),
  getBooking: (bookingId) => apiClient.get(`/bookings/${bookingId}`),
  getUserBookings: () => apiClient.get('/bookings/user/all')
};

export const paymentService = {
  processPayment: (bookingId, amount, method, cardDetails) => 
    apiClient.post('/payment/process', { bookingId, amount, method, cardDetails }),
  verifyPayment: (transactionId) => 
    apiClient.post('/payment/verify', { transactionId })
};
