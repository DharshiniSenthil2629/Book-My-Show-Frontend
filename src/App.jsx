import './styles/global.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import TheatreSelectionPage from './pages/TheatreSelectionPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="app">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/theatres" element={<ProtectedRoute><TheatreSelectionPage /></ProtectedRoute>} />
                <Route path="/seats/:showId" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
                <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/ticket/:bookingId" element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
