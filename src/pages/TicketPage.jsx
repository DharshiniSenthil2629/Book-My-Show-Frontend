import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/index';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './TicketPage.css';

export default function TicketPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBooking(bookingId);
      setBooking(response.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!booking) return <div className="ticket-error">Booking not found</div>;

  const handleDownload = () => {
    // Create a printable view of the ticket only and open print dialog
    const ticketEl = document.querySelector('.ticket');
    if (!ticketEl) {
      alert('Ticket not available for download');
      return;
    }

    const newWin = window.open('', '_blank');
    const styles = `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial; padding:20px; }
      .ticket { width: 700px; margin: 0 auto; }
      .ticket-header { display:flex; justify-content:space-between; align-items:center; }
      .ticket-main { display:flex; gap:20px; }
      .movie-section h2 { margin:0; }
      .price-row { display:flex; justify-content:space-between; }
    `;

    newWin.document.write(`<html><head><title>Ticket - ${booking.movie?.title}</title><style>${styles}</style></head><body>`);
    newWin.document.write(ticketEl.outerHTML);
    newWin.document.write('</body></html>');
    newWin.document.close();
    newWin.focus();
    // Delay to ensure images load
    setTimeout(() => {
      newWin.print();
      // keep window open for user to save, do not auto-close
    }, 500);
  };

  const handleShare = () => {
    const ticketText = `I just booked ${booking.movie?.title} at ${booking.theatre?.name}! 🎬`;
    navigator.share?.({
      title: 'BookMyShow Ticket',
      text: ticketText
    });
  };

  return (
    <div className="ticket-page">
      <div className="ticket-success">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your ticket has been successfully booked</p>
      </div>

      <div className="ticket-container">
        <div className="ticket">
          <div className="ticket-header">
            <div className="ticket-logo">🎬 BookMyShow</div>
            <div className="ticket-status confirmed">CONFIRMED</div>
          </div>

          <div className="ticket-main">
            <div className="movie-section">
              <h2>{booking.movie?.title}</h2>
              <p className="genre">{booking.movie?.genre}</p>
            </div>

            <div className="ticket-details">
              <div className="detail-row">
                <div className="detail-item">
                  <label>Theatre</label>
                  <value>{booking.theatre?.name}</value>
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <value>{booking.theatre?.city}</value>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Date</label>
                  <value>{new Date(booking.show?.date).toLocaleDateString()}</value>
                </div>
                <div className="detail-item">
                  <label>Time</label>
                  <value>{booking.show?.timing}</value>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Screen</label>
                  <value>{booking.show?.screen}</value>
                </div>
                <div className="detail-item">
                  <label>Seats</label>
                  <value className="seats-list">
                    {booking.seats?.map(s => s.number).join(', ')}
                  </value>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Booking ID</label>
                  <value className="booking-id">{booking.id.substring(0, 8).toUpperCase()}</value>
                </div>
                <div className="detail-item">
                  <label>Ticket ID</label>
                  <value className="ticket-id">{booking.ticketId}</value>
                </div>
              </div>
            </div>

            <div className="price-section">
              <div className="price-row">
                <span>Ticket Price</span>
                <span>₹{booking.amount}</span>
              </div>
              <div className="price-row">
                <span>Convenience Charges</span>
                <span>₹0</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{booking.amount}</span>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <p className="barcode-text">Scan the code at the theatre</p>
            <div className="barcode">
              █████████████████
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button onClick={handleDownload} className="action-btn download-btn">
          📥 Download Ticket
        </button>
        <button onClick={handleShare} className="action-btn share-btn">
          📤 Share Ticket
        </button>
        <button onClick={() => navigate('/')} className="action-btn home-btn">
          🏠 Back to Home
        </button>
      </div>

      <div className="important-info">
        <h3>Important Information</h3>
        <ul>
          <li>Please arrive at the theatre 15 minutes before the show time</li>
          <li>No refund will be given for no-shows</li>
          <li>Screen at the theatre will display your seat numbers</li>
          <li>Keep your ticket ID safe for reference</li>
        </ul>
      </div>
    </div>
  );
}
