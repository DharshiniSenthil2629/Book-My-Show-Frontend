import { useState, useEffect } from 'react';
import { movieService } from '../services/index';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import './HomePage.css';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchFilters();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies(1, 100); // fetch more movies to include other languages
      const list = response.data.movies || [];
      setMovies(list);
      // populate filters
      const langs = Array.from(new Set(list.map(m => m.language).filter(Boolean)));

      // split genre strings like "Action/Drama" into individual categories
      const catsRaw = list
        .map(m => m.genre || '')
        .flatMap(g => g.split(/[\/,&]/).map(s => s.trim()).filter(Boolean));
      const cats = Array.from(new Set(catsRaw));
      setLanguages(langs);
      setCategories(cats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const resp = await movieService.getFilters();
      setLanguages(resp.data.languages || []);
      setCategories(resp.data.categories || []);
    } catch (err) {
      // fallback: do nothing, existing fetchMovies population will work
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // use the unified filter handler so it always uses latest values
    await handleFilterChange(selectedLanguage, selectedCategory, query);
  };

  // allow passing values so callers can ensure latest value is used
  const handleFilterChange = async (lang = selectedLanguage, cat = selectedCategory, query = searchQuery) => {
    try {
      setLoading(true);

      // if no filters and no query, fetch paged list
      const noFilters = !lang && !cat && (!query || query.trim() === '');
      let resp;
      if (noFilters) {
        resp = await movieService.getAllMovies();
        const list = resp.data.movies || [];
        setMovies(list);
      } else {
        resp = await movieService.searchMovies(query || '', lang || '', cat || '');
        setMovies(resp.data.movies || []);
      }
    } catch (err) {
      setError('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to BookMyShow</h1>
        <p>Book your favorite movies and enjoy</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="filters">
          <select
            value={selectedLanguage}
            onChange={e => { const v = e.target.value; setSelectedLanguage(v); handleFilterChange(v, selectedCategory); }}
            className="filter-select"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={e => { const v = e.target.value; setSelectedCategory(v); handleFilterChange(selectedLanguage, v); }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p className="no-results">No movies found</p>
          )}
        </div>
      )}
    </div>
  );
}
