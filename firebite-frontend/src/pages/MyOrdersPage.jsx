import React, { useEffect, useState } from 'react';
import { FaShoppingBag, FaCalendarAlt, FaMoneyBillWave, 
         FaInfoCircle, FaCreditCard, FaSpinner, 
         FaTruck, FaBoxOpen, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <FaSpinner className="order-status-icon spin" />;
      case 'shipped':
        return <FaTruck className="order-status-icon" />;
      case 'delivered':
        return <FaBoxOpen className="order-status-icon" />;
      case 'refunded':
        return <FaUndo className="order-status-icon" />;
      default:
        return <FaInfoCircle className="order-status-icon" />;
    }
  };

  if (loading) return (
    <div className="order-loading">
      <FaSpinner className="loading-spinner" />
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="orders-container">
      <div className="orders-header">
        <FaShoppingBag className="header-icon" />
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <FaShoppingBag className="th-icon" />
                  Order ID
                </th>
                <th>
                  <FaCalendarAlt className="th-icon" />
                  Date
                </th>
                <th>
                  <FaMoneyBillWave className="th-icon" />
                  Amount
                </th>
                <th>Status</th>
                <th>
                  <FaCreditCard className="th-icon" />
                  Payment
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td className="order-amount">${order.totalAmount}</td>
                  <td>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td>{ 
                    order.status && order.status.toLowerCase() === 'canceled' ? (
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>Refunded</span>
                    ) : order.paymentMethod === 'bank' ? (
                      order.paymentCompletedAt
                        ? <span style={{ color: '#10b981', fontWeight: 600 }}>Bank - Payment Success</span>
                        : <span style={{ color: '#f59e0b', fontWeight: 600 }}>Bank - Pending Payment</span>
                    ) : order.paymentMethod === 'paypal' ? (
                      order.paymentCompletedAt
                        ? <span style={{ color: '#10b981', fontWeight: 600 }}>PayPal - Paid</span>
                        : <span style={{ color: '#f59e0b', fontWeight: 600 }}>PayPal - Pending</span>
                    ) : (
                      order.paymentMethod || 'Cash on Delivery'
                    )
                  }</td>
                  <td>
                    <button 
                      className="details-btn"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <FaInfoCircle className="btn-icon" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .orders-container {
          background-color: #000;
          min-height: 100vh;
          color: #fff;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }

        .order-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #fff;
          font-size: 1.2rem;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .orders-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .orders-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #fbbf24;
          margin-left: 1rem;
        }

        .header-icon {
          font-size: 2rem;
          color: #fbbf24;
        }

        .no-orders {
          text-align: center;
          padding: 3rem 0;
          font-size: 1.2rem;
          color: #ccc;
        }

        .orders-table-container {
          width: 100%;
          overflow-x: auto;
          margin: 0 auto;
          max-width: 1200px;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }

        .orders-table th {
          background-color: #fbbf24;
          color: #000;
          padding: 1rem;
          text-align: left;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .orders-table td {
          padding: 1rem;
          border-bottom: 1px solid #333;
          color: #e5e7eb;
        }

        .orders-table tr:hover {
          background-color: #111;
        }

        .th-icon {
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        .order-amount {
          color: #fbbf24;
          font-weight: bold;
        }

        .order-status {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .order-status.processing {
          color: #3b82f6;
        }

        .order-status.shipped {
          color: #f59e0b;
        }

        .order-status.delivered {
          color: #10b981;
        }

        .order-status.refunded {
          color: #ef4444;
        }

        .order-status-icon {
          margin-right: 0.5rem;
          font-size: 1rem;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .details-btn {
          background-color: #e7272d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: background-color 0.2s;
        }

        .details-btn:hover {
          background-color: #c11e24;
        }

        .btn-icon {
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .orders-container {
            padding: 1rem;
          }
          
          .orders-table th, 
          .orders-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrdersPage;