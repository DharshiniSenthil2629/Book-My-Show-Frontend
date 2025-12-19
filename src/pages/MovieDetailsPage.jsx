import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/index';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './MovieDetailsPage.css';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setSelectedMovie, setSelectedShow } = useBooking();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovieById(id);
      setMovie(response.data.movie);
      setShows(response.data.shows);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTickets = (show) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedMovie(movie);
    setSelectedShow(show);
    navigate('/theatres');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!movie) return <div className="movie-not-found">Movie not found</div>;

  return (
    <div className="movie-details-page">
      <div className="movie-header">
        <div className="movie-poster-large">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="movie-header-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="badge">{movie.genre}</span>
            <span className="badge">{movie.language}</span>
            <span className="badge">⭐ {movie.rating}</span>
          </div>
          <p className="description">{movie.description}</p>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Director:</strong>
              <span>{movie.director}</span>
            </div>
            <div className="detail-item">
              <strong>Duration:</strong>
              <span>{movie.duration} min</span>
            </div>
            <div className="detail-item">
              <strong>Release Date:</strong>
              <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="cast">
            <strong>Cast:</strong>
            <div className="cast-list">
              {movie.cast.map((actor, idx) => (
                <span key={idx} className="cast-member">{actor}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shows-section">
        <h2>Select a Show</h2>
        {shows.length > 0 ? (
          <div className="shows-grid">
            {shows.map(show => (
              <div key={show.id} className="show-card">
                <div className="show-info">
                  <h3>{show.theatre?.name}</h3>
                  <p className="show-location">{show.theatre?.city}</p>
                  <p className="show-timing">
                    <strong>{show.timing}</strong>
                  </p>
                  <p className="show-screen">{show.screen}</p>
                  <div className="show-prices">
                    <div className="price-item">
                      <span className="type">Normal</span>
                      <span className="price">₹{show.priceNormal}</span>
                    </div>
                    <div className="price-item">
                      <span className="type">Premium</span>
                      <span className="price">₹{show.pricePremium}</span>
                    </div>
                    <div className="price-item">
                      <span className="type">Recliner</span>
                      <span className="price">₹{show.priceRecliner}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="book-show-btn"
                  onClick={() => handleBookTickets(show)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-shows">No shows available for this movie</p>
        )}
      </div>
    </div>
  );
}
