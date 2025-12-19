import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/index';
import { useBooking } from '../hooks/useBooking';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './SeatSelectionPage.css';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { selectedMovie, selectedShow, lockSeats, setSelectedSeats, setTotalAmount } = useBooking();
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockingSeats, setLockingSeats] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAvailableSeats(showId);
      setSeats(response.data.seats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.booked || seat.locked) {
      alert(`Seat ${seat.number} is not available`);
      return;
    }

    setSelectedSeatIds(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };

  const calculatePrice = (seatIds) => {
    return seatIds.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      if (!seat) return total;
      
      const showData = selectedShow;
      let price = 0;
      if (seat.type === 'normal') price = showData.priceNormal;
      else if (seat.type === 'premium') price = showData.pricePremium;
      else if (seat.type === 'recliner') price = showData.priceRecliner;
      
      return total + price;
    }, 0);
  };

  const handleProceedToPayment = async () => {
    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setLockingSeats(true);
    try {
      const result = await lockSeats(showId, selectedSeatIds);
      if (result.success) {
        const amount = calculatePrice(selectedSeatIds);
        setSelectedSeats(selectedSeatIds);
        setTotalAmount(amount);
        
        // Confirm booking
        const bookingResult = await bookingService.confirmBooking(showId, selectedSeatIds, amount);
        if (bookingResult.data?.booking) {
          navigate(`/payment/${bookingResult.data.booking.id}`);
        }
      } else {
        setError(result.error);
      }
    } finally {
      setLockingSeats(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!selectedMovie || !selectedShow) {
    return (
      <div className="seat-page">
        <p className="error-text">Please select a movie and show first</p>
        <button onClick={() => navigate('/')} className="back-btn">Go Back</button>
      </div>
    );
  }

  const totalPrice = calculatePrice(selectedSeatIds);

  return (
    <div className="seat-page">
      <div className="seat-header">
        <h1>Select Your Seats</h1>
        <p className="movie-show-info">
          {selectedMovie.title} - {selectedShow.timing} at {selectedShow.theatre.name}
        </p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="seat-container">
        <div className="screen">SCREEN</div>
        
        <div className="seats-grid">
          {seats.map(seat => (
            <button
              key={seat.id}
              className={`seat ${seat.type} ${
                seat.booked ? 'booked' : 
                seat.locked ? 'locked' : 
                selectedSeatIds.includes(seat.id) ? 'selected' : ''
              }`}
              disabled={seat.booked || seat.locked}
              onClick={() => handleSeatClick(seat)}
              title={`${seat.number} - ${seat.type}`}
            >
              {seat.number}
            </button>
          ))}
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat locked"></div>
            <span>Locked</span>
          </div>
        </div>
      </div>

      <div className="seat-pricing">
        <h3>Seat Pricing</h3>
        <div className="pricing-grid">
          <div className="price-type">
            <span className="type-label normal">Normal</span>
            <span className="price">₹{selectedShow.priceNormal}</span>
          </div>
          <div className="price-type">
            <span className="type-label premium">Premium</span>
            <span className="price">₹{selectedShow.pricePremium}</span>
          </div>
          <div className="price-type">
            <span className="type-label recliner">Recliner</span>
            <span className="price">₹{selectedShow.priceRecliner}</span>
          </div>
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-left">
          <div className="selected-seats-info">
            <strong>Selected Seats:</strong>
            <span className="seats-count">
              {selectedSeatIds.length > 0 
                ? seats.filter(s => selectedSeatIds.includes(s.id)).map(s => s.number).join(', ')
                : 'None'
              }
            </span>
          </div>
        </div>
        
        <div className="summary-right">
          <div className="total-amount">
            <strong>Total Amount:</strong>
            <span className="amount">₹{totalPrice}</span>
          </div>
          <button 
            className="payment-btn"
            onClick={handleProceedToPayment}
            disabled={selectedSeatIds.length === 0 || lockingSeats}
          >
            {lockingSeats ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
