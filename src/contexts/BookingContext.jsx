import { createContext, useState, useCallback } from 'react';
import { bookingService } from '../services/index';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lockSeats = useCallback(async (showId, seatIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.lockSeats(showId, seatIds);
      setLockedSeats(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to lock seats';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmBooking = useCallback(async (showId, seatIds, amount) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.confirmBooking(showId, seatIds, amount);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.error || 'Booking failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetBooking = useCallback(() => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setLockedSeats(null);
    setTotalAmount(0);
    setError(null);
  }, []);

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedTheatre,
    setSelectedTheatre,
    selectedShow,
    setSelectedShow,
    selectedSeats,
    setSelectedSeats,
    lockedSeats,
    setLockedSeats,
    totalAmount,
    setTotalAmount,
    loading,
    error,
    lockSeats,
    confirmBooking,
    resetBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
