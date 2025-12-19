import { useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import './TheatreSelectionPage.css';

export default function TheatreSelectionPage() {
  const navigate = useNavigate();
  const { selectedMovie, selectedShow } = useBooking();

  if (!selectedMovie || !selectedShow) {
    return (
      <div className="theatre-page">
        <p className="error-text">Please select a movie and show first</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  const handleSelectSeats = () => {
    navigate(`/seats/${selectedShow.id}`);
  };

  return (
    <div className="theatre-page">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumb-link">Movies</span>
        <span className="breadcrumb-sep">›</span>
        <span onClick={() => navigate(`/movie/${selectedMovie.id}`)} className="breadcrumb-link">
          {selectedMovie.title}
        </span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Select Seats</span>
      </div>

      <div className="theatre-info">
        <h2>{selectedShow.theatre.name}</h2>
        <p className="location">{selectedShow.theatre.city}</p>
      </div>

      <div className="show-details">
        <div className="detail">
          <strong>Show Timing:</strong> {selectedShow.timing}
        </div>
        <div className="detail">
          <strong>Screen:</strong> {selectedShow.screen}
        </div>
        <div className="detail">
          <strong>Date:</strong> {new Date(selectedShow.date).toLocaleDateString()}
        </div>
        <div className="detail">
          <strong>Movie:</strong> {selectedMovie.title}
        </div>
      </div>

      <div className="seat-selection-action">
        <button onClick={handleSelectSeats} className="proceed-btn">
          Proceed to Seat Selection →
        </button>
      </div>
    </div>
  );
}
