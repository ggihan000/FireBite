import React, { useEffect, useState } from 'react';
import { Spinner, Button, Form } from 'react-bootstrap';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [shipping, setShipping] = useState("flat");
  const shippingCost = 0;

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await fetch('/api/cart/', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`
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

  const handleQuantityChange = (index, delta) => {
    const newItems = [...items];
    const newQty = newItems[index].qty + delta;
    if (newQty > 0) {
      newItems[index].qty = newQty;
      newItems[index].subtotal = newQty * parseFloat(newItems[index].price);
      setItems(newItems);
      recalculateTotal(newItems);
    }
  };

  const recalculateTotal = (updatedItems) => {
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    setTotal(newTotal);
  };

  const handleApplyCoupon = () => {
    alert(`Coupon "${coupon}" applied!`);
    // Implement real coupon logic here
  };

  const handleUpdateCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await fetch('/api/cart/updatecart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({ menuId: item.menuId, qty: item.qty }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update cart');
      // Fetch new cart data
      const res2 = await fetch('/api/cart/', {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`
        },
      });
      const data2 = await res2.json();
      setItems(data2.items || []);
      setTotal(data2.total || 0);
    } catch (err) {
      alert(err.message || 'Failed to update cart');
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div style={{ backgroundColor: '#000', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold' }}>Your Cart</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted py-5">Your cart is empty.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-dark table-borderless align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Id</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px dashed #333' }}>
                    <td>
                      <Button className="text-danger p-0" style={{ fontSize: '2rem', lineHeight: 1 , backgroundColor: 'transparent', border: 'none' }} onClick={() => {
                        const updatedItems = items.filter((_, i) => i !== index);
                        setItems(updatedItems);
                        recalculateTotal(updatedItems);
                      }}>
                        &times;
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={`/uploads/${item.image}`}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '8px' }}
                          className="me-2"
                        />
                        {item.name}
                      </div>
                    </td>
                    <td>{item.productId || `FA-001-00${index + 1}`}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-light" size="sm" onClick={() => handleQuantityChange(index, -1)}>-</Button>
                        <span className="fw-bold">{item.qty}</span>
                        <Button variant="outline-light" size="sm" onClick={() => handleQuantityChange(index, 1)}>+</Button>
                      </div>
                    </td>
                    <td className="text-warning fw-bold">
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 my-4">
            <div className="d-flex flex-row flex-md-row gap-2">
              <Form.Control
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="rounded-pill bg-dark border border-secondary text-white px-3"
                style={{ flex: 1 }}
              />
              <Button variant="danger" className="rounded-pill fw-bold px-4" onClick={handleApplyCoupon}>
                Apply Coupon
              </Button>
            </div>
            <Button variant="danger" className="rounded-pill fw-bold px-4 align-self-start align-self-md-center" onClick={handleUpdateCart}>
              Update Cart
            </Button>
          </div>

          <div className="row mt-5 justify-content-center">
            <div className="col-md-6">
              <div style={{ border: '1px dashed #555', padding: '1rem', borderRadius: '12px' }}>
                <h4 className="fw-bold mb-3">Cart Totals</h4>
                <div className="d-flex justify-content-between">
                  <span>Sub Total</span>
                  <span>$ {parseFloat(total).toFixed(2)}</span>
                </div>
                <div className="mt-3">
                  <span className="d-block mb-2">Shipping</span>
                  <Form.Check
                    type="radio"
                    label="Flat Rate"
                    name="shipping"
                    checked={shipping === 'flat'}
                    onChange={() => setShipping('flat')}
                  />
                  <Form.Check
                    type="radio"
                    label="Express Delivery"
                    name="shipping"
                    checked={shipping === 'express'}
                    onChange={() => setShipping('express')}
                  />
                  <Form.Check
                    type="radio"
                    label="In-Stock Pick up"
                    name="shipping"
                    checked={shipping === 'pickup'}
                    onChange={() => setShipping('pickup')}
                  />
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <span>Total</span>
                  <span className="fw-bold">$ {parseFloat(total + shippingCost).toFixed(2)}</span>
                </div>
                <Button variant="danger" className="w-100 mt-4 fw-bold rounded-pill" onClick={handleCheckout}>
                  Proceed To Checkout
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
