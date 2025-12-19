import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 BookMyShow
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <button onClick={logout} className="navbar-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link navbar-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
