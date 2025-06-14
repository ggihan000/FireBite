import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

const CartPopup = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await fetch('/api/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load cart');
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error loading cart:', error);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  return (
    <div
      className="position-fixed top-0 end-0 vh-100 p-4"
      style={{
        zIndex: 1060,
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1c1c1c',
        color: 'white',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0">Your Cart</h5>
        <button className="btn btn-close btn-close-white" onClick={onClose}></button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="mb-3">Your cart is empty.</div>
          <div className="mb-4 small text-white-50">Test: Your cart is empty.</div>
          <Button
            variant="warning"
            className="fw-bold px-4 py-2 rounded-pill shadow-sm"
            style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}
            onClick={() => window.location.href = '/menu'}
          >
            Go to Menu Page
          </Button>
        </div>
      ) : (
        <>
          {items.map((item, index) => (
            <div key={index} className="d-flex mb-3 border-bottom pb-2">
              <img
                src={`/uploads/${item.image}`}
                alt={item.name}
                style={{ width: 60, height: 60, objectFit: 'cover' }}
                className="me-3 rounded"
              />
              <div className="flex-grow-1">
                <div className="fw-bold">{item.name}</div>
                {/* <div className="small text-white">Qty: {item.qty}</div> */}
                <div className="text-warning">
                  $ {parseFloat(item.price).toFixed(2)} x {item.qty}
                </div>
              </div>
              <div className="ms-2 text-end fw-bold text-white">
                $ {parseFloat(item.subtotal).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4 mb-3 pt-1">
            <span className="fw-bold pt-2">Total:</span>
            <h4>$ {parseFloat(total).toFixed(2)}</h4>
          </div>

          <Button variant="danger" className="w-100 mb-2 fw-bold" onClick={() => window.location.href = '/checkout'}>
            Proceed to Checkout
          </Button>
          <Button variant="warning" className="w-100 fw-bold" onClick={() => window.location.href = '/cart'}>
            View Full Cart
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPopup;
