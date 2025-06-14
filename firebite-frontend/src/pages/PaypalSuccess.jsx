// pages/paypal/Success.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaypalSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const paypalOrderId = searchParams.get('token'); // PayPal returns token as order ID
  const localOrderId = searchParams.get('orderId');

  useEffect(() => {
    const capturePayment = async () => {
      if (!paypalOrderId || !localOrderId) {
        setStatus('error');
        setMessage('Missing PayPal or Order ID.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders/paypal/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ paypalOrderId, localOrderId })
        });
        const data = await res.json();
        if (res.ok && data.status === 'COMPLETED') {
          setStatus('success');
          setMessage('Payment successful! Your order has been placed.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment was not completed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Something went wrong capturing payment.');
      }
    };

    capturePayment();
  }, [paypalOrderId, localOrderId]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111', borderRadius: 18, boxShadow: '0 4px 24px #000a', padding: '48px 32px', minWidth: 340, maxWidth: 420, width: '100%', textAlign: 'center', border: '2px solid #ffc107' }}>
        <h2 style={{ color: '#ffc107', fontWeight: 700 }}>PayPal Payment Status</h2>
        {status === 'processing' && <p style={{ color: '#fff', margin: '32px 0' }}>Capturing your payment, please wait...</p>}
        {status === 'success' && (
          <>
            <p className="text-success" style={{ color: '#4caf50', fontWeight: 600, margin: '32px 0 16px' }}>{message}</p>
            <button onClick={() => navigate('/my-orders')} style={{ background: '#ffc107', color: '#111', border: 'none', borderRadius: 24, padding: '12px 32px', fontWeight: 600, fontSize: 18, marginBottom: 8, width: '100%', boxShadow: '0 2px 8px #0004', cursor: 'pointer' }}>
              View My Orders
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-danger" style={{ color: '#f44336', fontWeight: 600, margin: '32px 0 16px' }}>{message}</p>
            <button onClick={() => navigate('/')} style={{ background: 'none', color: '#ffc107', border: 'none', fontSize: 16, marginTop: 8, cursor: 'pointer' }}>
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaypalSuccess;
