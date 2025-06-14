// pages/paypal/Cancel.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PaypalCancel = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const localOrderId = searchParams.get('orderId');

  useEffect(() => {
    const notifyCancel = async () => {
      if (!localOrderId) return;
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/orders/paypal/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ localOrderId })
        });
      } catch (err) {
        // Optionally handle error
      }
    };
    notifyCancel();
  }, [localOrderId, navigate]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111', borderRadius: 18, boxShadow: '0 4px 24px #000a', padding: '48px 32px', minWidth: 340, maxWidth: 420, width: '100%', textAlign: 'center', border: '2px solid #ffc107' }}>
        <h2 style={{ color: '#ffc107', fontWeight: 700 }}>Payment Cancelled</h2>
        <p style={{ color: '#ff9800', marginBottom: 32 }}>You cancelled your PayPal payment. No money was deducted.</p>
        <button onClick={() => navigate('/menu')} style={{ background: '#ffc107', color: '#111', border: 'none', borderRadius: 24, padding: '12px 32px', fontWeight: 600, fontSize: 18, marginBottom: 16, width: '100%', boxShadow: '0 2px 8px #0004', cursor: 'pointer' }}>
          Return to Menu
        </button>
        <br />
        <button onClick={() => navigate('/')} style={{ background: 'none', color: '#ffc107', border: 'none', fontSize: 16, marginTop: 8,  cursor: 'pointer' }}>
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaypalCancel;
