# BookMyShow Frontend

React application for BookMyShow ticket booking system.

## Features

- User authentication (Login/Signup)
- Browse movies
- Select theatre and show timings
- Seat selection with real-time locking
- Multiple payment methods
- Booking confirmation and tickets
- View booking history

## Setup

```bash
cd frontend
npm install
```

## Running the Application

**Development Mode:**
```bash
npm run dev
```

Application runs on `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorAlert.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── MovieDetailsPage.jsx
│   │   ├── TheatreSelectionPage.jsx
│   │   ├── SeatSelectionPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── TicketPage.jsx
│   │   └── BookingsPage.jsx
│   ├── services/
│   │   ├── apiClient.js
│   │   └── index.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── BookingContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useBooking.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Demo Credentials

Email: `test@example.com`
Password: `password123`

## Features Explained

### Authentication
- JWT-based authentication
- Secure token storage in localStorage
- Protected routes for authenticated users

### Movie Booking Flow
1. Browse movies on home page
2. Select a movie to view details and shows
3. Book tickets and select theatre
4. Choose seats with real-time availability
5. Lock seats for 5 minutes
6. Proceed to payment
7. Complete payment and view ticket

### Seat Selection
- Real-time seat availability
- Seat locking with 5-minute TTL
- Different seat types (Normal, Premium, Recliner)
- Dynamic pricing based on seat type

### Payment
- Multiple payment methods (Card, UPI, Wallet)
- Test card: 4111 1111 1111 1111
- Payment confirmation page

### Ticket Management
- View digital ticket with QR code
- Download ticket (feature)
- Share ticket (feature)
- View booking history

## API Integration

Frontend connects to backend at `http://localhost:5000/api`

All requests automatically include JWT token from localStorage.

## Styling

Uses normal CSS (no frameworks) for styling.
Responsive design for mobile, tablet, and desktop.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
