import { useState, useEffect } from 'react';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [bankDetailsVisible, setBankDetailsVisible] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Fetch cart
        const cartRes = await fetch('/api/cart/', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });
        const cartData = await cartRes.json();
        setCartData(cartData);

        // Fetch latest order
        const orderRes = await fetch('/api/orders/last', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (orderRes.ok) {
            const lastOrder = await orderRes.json();

            // Only update form if at least one field exists
            if (lastOrder.firstName || lastOrder.address) {
            setForm(prev => ({
                ...prev,
                firstName: lastOrder.firstName || '',
                lastName: lastOrder.lastName || '',
                country: lastOrder.country || '',
                address: lastOrder.address || '',
                city: lastOrder.city || '',
                state: lastOrder.state || '',
                zip: lastOrder.zip || '',
                phone: lastOrder.phone || '',
                email: lastOrder.email || '',
            }));
            }
        }
        } catch (err) {
        console.error('Error loading initial data:', err.message);
        }
    };

    fetchInitialData();
    }, []);



  const validate = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!['notes'].includes(key) && !value.trim()) {
        newErrors[key] = 'Required';
      }
    });

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    const address = { ...form };
    const items = cartData.items.map(item => ({ menuId: item.menuId, qty: item.qty }));
    const payload = {
      items,
      address,
      paymentMethod,
    };
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Order failed');
      localStorage.setItem('lastOrder', JSON.stringify(payload));
      const orderResult = await res.json();
      setOrderPlaced(true);
      if (orderResult.approvalUrl) {
        window.location.href = orderResult.approvalUrl;
      }
      setOrderId(orderResult.orderId || orderResult.id || '');
      setPopupVisible(true);
      setBankDetailsVisible(paymentMethod === 'bank');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '40px',
      backgroundColor: '#000',
      color: 'white',
      gap: '40px',
    },
    column: {
      flex: 1,
      minWidth: '300px',
    },
    input: {
      padding: '12px',
      borderRadius: '25px',
      border: '1px dashed #555',
      backgroundColor: '#111',
      color: 'white',
      marginBottom: '10px',
      width: '100%',
    },
    error: {
      color: '#f44336',
      fontSize: '12px',
      marginTop: '-8px',
      marginBottom: '10px',
    },
    label: {
      marginTop: '15px',
      display: 'block',
    },
    button: {
      marginTop: '20px',
      background: '#f44336',
      color: 'white',
      border: 'none',
      padding: '14px',
      borderRadius: '30px',
      fontWeight: 'bold',
      width: '100%',
      cursor: 'pointer',
      opacity: loading ? 0.7 : 1,
    },
    total: {
      fontWeight: 'bold',
      fontSize: '20px',
      marginTop: '10px',
    },
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#111',
      padding: '30px',
      borderRadius: '15px',
      color: 'white',
      boxShadow: '0 0 15px #000',
      zIndex: 999,
      textAlign: 'center',
    },
    overlay: {
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 998,
    },
    bankDetails: {
      color: '#ccc',
      fontSize: '14px',
      marginTop: '10px',
      textAlign: 'left',
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.column}>
          <h3>Billing Details</h3>
          {Object.keys(form).map((key) => (
            <div key={key}>
              <input
                name={key}
                type={key === 'email' ? 'email' : 'text'}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={form[key]}
                onChange={handleChange}
                style={styles.input}
              />
              {errors[key] && <div style={styles.error}>{errors[key]}</div>}
            </div>
          ))}
        </div>

        <div style={styles.column}>
          <h4>Cart Totals</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartData.items.map(item => (
              <li key={item.menuId} style={{ marginBottom: '8px', color: '#f44336', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span>${item.subtotal}</span>
              </li>
            ))}
          </ul>
          <p style={styles.total}>Total: ${cartData.total.toFixed(2)}</p>

          <div style={{ marginTop: '20px' }}>
            <h4>Payment Method</h4>
            {['bank', 'cash', 'paypal'].map(method => (
              <label style={styles.label} key={method}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />{' '}
                {method === 'bank' ? 'Direct Bank Transfer' :
                  method === 'cash' ? 'Cash On Delivery' : 'PayPal'}
              </label>
            ))}

            <label style={{ fontSize: '12px', display: 'block', marginTop: '15px' }}>
              <input type="checkbox" required defaultChecked /> I’ve read and accept the <a href="#">Terms & Conditions</a>
            </label>

            <button style={styles.button} onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {popupVisible && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popup}>
            <h2>✅ Order Placed!</h2>
            <p>Thank you for your purchase.</p>
            {orderId && (
              <p style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: 18 }}>Order ID: {orderId}</p>
            )}
            {bankDetailsVisible && (
              <div style={styles.bankDetails}>
                <strong>Bank Transfer Instructions:</strong><br />
                <span>Bank: ABC Bank</span><br />
                <span>Account No: 123456789</span><br />
                <span>Use your Order ID as payment reference.</span>
              </div>
            )}
            {paymentMethod === 'paypal' ? (
              <p style={{ color: '#f44336', fontWeight: 'bold', marginTop: 24 }}>
                Redirecting to PayPal...
              </p>
            ) : (
              <button style={{ ...styles.button, marginTop: '20px' }} onClick={() => {
                setPopupVisible(false);
                window.location.href = '/my-orders';
              }}>
                View All Orders
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutPage;
