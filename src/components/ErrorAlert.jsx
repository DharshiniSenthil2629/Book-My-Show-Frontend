import './ErrorAlert.css';

export default function ErrorAlert({ message, onClose }) {
  return (
    <div className="error-alert">
      <span className="error-icon">⚠️</span>
      <span className="error-message">{message}</span>
      {onClose && (
        <button className="error-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
}
