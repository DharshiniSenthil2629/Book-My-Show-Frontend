import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/index';
import ErrorAlert from '../components/ErrorAlert';
import './PaymentPage.css';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '4111111111111111',
    cardHolder: 'Test User',
    expiryMonth: '12',
    expiryYear: '25',
    cvv: '123'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.processPayment(
        bookingId,
        5000, // Mock amount
        paymentMethod,
        paymentMethod === 'card' ? formData : null
      );

      if (result.data.success) {
        navigate(`/ticket/${bookingId}`);
      } else {
        setError(result.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Payment</h1>
        
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div className="payment-content">
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            
            <div className="method-options">
              <label className={`method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-name">💳 Credit/Debit Card</span>
              </label>

              <label className={`method-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="method"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-name">📱 UPI</span>
              </label>

              <label className={`method-option ${paymentMethod === 'wallet' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="method"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-name">💼 Wallet</span>
              </label>
            </div>
          </div>

          <form className="payment-form" onSubmit={handlePayment}>
            {paymentMethod === 'card' && (
              <>
                <h2>Card Details</h2>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4111 1111 1111 1111"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardHolder">Card Holder Name</label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryMonth">Expiry Month</label>
                    <input
                      type="text"
                      id="expiryMonth"
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      placeholder="MM"
                      maxLength="2"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryYear">Expiry Year</label>
                    <input
                      type="text"
                      id="expiryYear"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      placeholder="YY"
                      maxLength="2"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label htmlFor="upiId">UPI ID</label>
                <input
                  type="email"
                  id="upiId"
                  placeholder="yourname@bankname"
                  required
                />
                <p className="info-text">Demo: test@upi</p>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="wallet-info">
                <p>Select from your saved wallets:</p>
                <div className="wallet-options">
                  <button type="button" className="wallet-btn">Google Pay</button>
                  <button type="button" className="wallet-btn">PhonePe</button>
                  <button type="button" className="wallet-btn">Paytm</button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="pay-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay ₹5000'}
            </button>
          </form>
        </div>

        <p className="test-note">
          🔒 This is a demo. Use test card: 4111 1111 1111 1111
        </p>
      </div>
    </div>
  );
}
