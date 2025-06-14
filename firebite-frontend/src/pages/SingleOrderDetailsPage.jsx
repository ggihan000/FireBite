import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaCalendarAlt, FaBox, FaMoneyBillWave, FaBan } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { RiLoader4Line } from 'react-icons/ri';

const SingleOrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        });
        if (!res.ok) throw new Error('Order fetch failed');
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <RiLoader4Line className="spin" />;
      case 'confirmed':
        return <GiConfirmed />;
      case 'shipped':
        return <FaBox />;
      case 'delivered':
        return <GiConfirmed />;
      case 'cancelled':
        return <><FaBan style={{ color: '#f87171', marginRight: 6 }} /><span style={{ color: '#f87171', fontWeight: 700 }}></span></>;
      default:
        return <RiLoader4Line className="spin" />;
    }
  };

  if (loading) return (
    <div className="order-loading">
      <RiLoader4Line className="loading-spinner spin" />
      <p>Loading order details...</p>
    </div>
  );

  if (!order) return (
    <div className="no-order">
      <p>Order not found</p>
    </div>
  );

  return (
    <div className="order-details-container">
      <div className="order-header">
        <FaShoppingBag className="header-icon" />
        <h1>Order #{order.id}</h1>
      </div>

      <div className="order-sections">
        <section className="order-info">
          <h2>
            <FaUser className="section-icon" />
            Customer Information
          </h2>
          <div className="info-grid">
            <div>
              <p className="info-label">Name</p>
              <p className="info-value">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">{order.email}</p>
            </div>
            <div>
              <p className="info-label">Phone</p>
              <p className="info-value">{order.phone}</p>
            </div>
          </div>

          <h2>
            <FaMapMarkerAlt className="section-icon" />
            Shipping Address
          </h2>
          <div className="address-info">
            <p>{order.address}</p>
            <p>{order.city}, {order.state} {order.zip}</p>
            <p>{order.country}</p>
          </div>
        </section>

        <section className="order-status">
          <h2>
            <FaBox className="section-icon" />
            Order Status
          </h2>
          <div className={`status-badge ${order.status.toLowerCase()}`}>
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </div>

          <h2>
            <FaCreditCard className="section-icon" />
            Payment Information
          </h2>
          <div className="payment-info">
            <p><strong>Method:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
            <p><strong>Status:</strong> {
              order.paymentMethod === 'bank'
                ? order.paymentCompletedAt
                  ? <span style={{ color: '#10b981', fontWeight: 600 }}>Payment Success</span>
                  : <span style={{ color: '#f59e0b', fontWeight: 600 }}>Pending Payment</span>
                : <span style={{ color: '#10b981', fontWeight: 600 }}>Paid</span>
            }</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </section>
      </div>

      <section className="order-items">
        <h2>
          <FaShoppingBag className="section-icon" />
          Order Items
        </h2>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="product-cell">
                    {item.image && (
                      <img 
                        src={`/uploads/${item.image}`} 
                        alt={item.itemName} 
                        className="product-image"
                      />
                    )}
                    <span>{item.itemName}</span>
                  </td>
                  <td>${item.price}</td>
                  <td>{item.qty}</td>
                  <td className="text-yellow">${item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="order-total">
        <div className="total-amount">
          <FaMoneyBillWave className="total-icon" />
          <span>Total:</span>
          <span className="amount">${order.totalAmount}</span>
        </div>
      </div>

      <style jsx>{`
        .order-details-container {
          background-color: #000;
          min-height: 100vh;
          color: #fff;
          padding: 2rem;
          font-family: Arial, sans-serif;
          margin: 0 auto;
        }

        .order-loading, .no-order {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #fff;
          font-size: 1.2rem;
        }

        .loading-spinner {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .order-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .order-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #fbbf24;
          margin-left: 1rem;
        }

        .header-icon {
          font-size: 2rem;
          color: #fbbf24;
        }

        .order-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .order-sections {
            grid-template-columns: 1fr;
          }
        }

        section {
          background-color: #111;
          border-radius: 8px;
          padding: 1.5rem;
        }

        h2 {
          font-size: 1.2rem;
          color: #fbbf24;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .section-icon {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-label {
          color: #999;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
        }

        .address-info p {
          margin-bottom: 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          font-weight: bold;
        }

        .status-badge svg {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .status-badge.pending {
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .status-badge.confirmed {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.shipped {
          background-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .status-badge.delivered {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.cancelled {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .payment-info p {
          margin-bottom: 0.5rem;
        }

        .order-items {
          margin-bottom: 2rem;
        }

        .items-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background-color: #222;
          padding: 1rem;
          text-align: left;
          font-weight: bold;
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid #333;
        }

        .product-cell {
          display: flex;
          align-items: center;
        }

        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 1rem;
        }

        .text-yellow {
          color: #fbbf24;
          font-weight: bold;
        }

        .order-total {
          display: flex;
          justify-content: flex-end;
        }

        .total-amount {
          background-color: #222;
          padding: 1rem 2rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          font-size: 1.2rem;
        }

        .total-amount span {
          margin: 0 0.5rem;
        }

        .total-icon {
          color: #fbbf24;
          font-size: 1.5rem;
        }

        .amount {
          color: #fbbf24;
          font-weight: bold;
          font-size: 1.4rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SingleOrderDetailsPage;