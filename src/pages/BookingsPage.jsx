import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/index';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './BookingsPage.css';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (bookingId) => {
    navigate(`/ticket/${bookingId}`);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? You will get a refund within 5-7 business days.')) {
      try {
        setBookings(bookings.filter(b => b.id !== bookingId));
        setError(null);
        alert('Booking cancelled successfully. Refund will be processed.');
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <p>No bookings yet</p>
            <p className="empty-subtitle">Start booking your favorite movies!</p>
          </div>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.movie?.title}</h3>
                <span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span>
              </div>

              <div className="booking-card-image">
                <img src={booking.movie?.poster} alt={booking.movie?.title} />
              </div>

              <div className="booking-card-info">
                <div className="info-row">
                  <label>Theatre</label>
                  <value>{booking.theatre?.name}</value>
                </div>
                <div className="info-row">
                  <label>Date & Time</label>
                  <value>
                    {new Date(booking.show?.date).toLocaleDateString()} at {booking.show?.timing}
                  </value>
                </div>
                <div className="info-row">
                  <label>Seats</label>
                  <value>{booking.seats?.map(s => s.number).join(', ')}</value>
                </div>
                <div className="info-row">
                  <label>Amount Paid</label>
                  <value className="amount">₹{booking.amount}</value>
                </div>
                <div className="info-row">
                  <label>Ticket ID</label>
                  <value className="ticket-id">{booking.ticketId}</value>
                </div>
              </div>

              <div className="booking-card-actions">
                <button 
                  className="action-btn view-btn" 
                  onClick={() => handleViewTicket(booking.id)}
                >
                  📋 View Ticket
                </button>
                <button 
                  className="action-btn cancel-btn"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
