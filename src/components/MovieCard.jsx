import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <button className="book-btn">Book Tickets</button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <div className="movie-rating">
          <span className="rating">★ {movie.rating}</span>
          <span className="language">{movie.language}</span>
        </div>
      </div>
    </div>
  );
}
