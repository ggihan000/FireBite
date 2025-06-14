import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUserFriends, FaClock, FaPlus, FaTimes } from 'react-icons/fa';
import { RiReservedLine } from 'react-icons/ri';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    partySize: 1,
    reservationDate: '',
    reservationTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reservations/my', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch reservations');
      const data = await res.json();
      setReservations(data.reservations);
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidDate = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day >= 1 && day <= 6; // Mon to Sat
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidDate(form.reservationDate)) {
      return alert('Reservation date must be Monday to Saturday.');
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create reservation');
      setShowModal(false);
      fetchReservations();
    } catch (err) {
      console.error('Failed to create reservation', err);
    }
  };

  const handleCancel = async (id) => {
    setConfirmCancelId(id);
  };

  const confirmCancelReservation = async () => {
    if (!confirmCancelId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ reservationId: confirmCancelId }),
      });
      if (!res.ok) throw new Error('Cancel failed');
      setConfirmCancelId(null);
      fetchReservations();
    } catch (err) {
      console.error('Cancel failed', err);
      setConfirmCancelId(null);
    }
  };

  const cancelCancelReservation = () => {
    setConfirmCancelId(null);
  };

  const today = new Date();

  if (loading) return (
    <div className="reservation-loading">
      <div className="loading-spinner"></div>
      <p>Loading your reservations...</p>
    </div>
  );

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <RiReservedLine className="header-icon" />
        <h1>My Reservations</h1>
        <button
          onClick={() => setShowModal(true)}
          className="add-reservation-btn"
        >
          <FaPlus className="btn-icon" />
          Add Reservation
        </button>
      </div>

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>
                <FaUserFriends className="th-icon" />
                Seats
              </th>
              <th>
                <FaCalendarAlt className="th-icon" />
                Date
              </th>
              <th>
                <FaClock className="th-icon" />
                Time
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const resDate = new Date(res.reservationDate);
              const isFuture = resDate > today;
              const isCanceled = res.status === 'cancelled' || res.status === 'canceled';
              let statusLabel = '';
              let statusClass = '';
              if (isCanceled) {
                statusLabel = 'Canceled';
                statusClass = 'status-canceled';
              } else if (isFuture && res.status === 'pending') {
                statusLabel = 'Upcoming';
                statusClass = 'status-upcoming';
              } else {
                statusLabel = 'Completed';
                statusClass = 'status-completed';
              }
              
              return (
                <tr key={res.id}>
                  <td>#{res.id}</td>
                  <td>{res.partySize}</td>
                  <td>{resDate.toLocaleDateString()}</td>
                  <td>{res.reservationTime}</td>
                  <td>
                    <span className={statusClass}>{statusLabel}</span>
                  </td>
                  <td>
                    {!isCanceled && isFuture ? (
                      <button
                        onClick={() => handleCancel(res.id)}
                        className="cancel-btn"
                      >
                        <FaTimes className="btn-icon" />
                        Cancel
                      </button>
                    ) : (
                      <span className="expired-badge">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan="6" className="no-reservations">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Reservation</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="reservation-form">
              <div className="form-group">
                <label>
                  <FaUserFriends className="input-icon" />
                  Party Size
                </label>
                <input
                  type="number"
                  name="partySize"
                  min={1}
                  max={20}
                  required
                  value={form.partySize}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaCalendarAlt className="input-icon" />
                  Date
                </label>
                <input
                  type="date"
                  name="reservationDate"
                  required
                  value={form.reservationDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaClock className="input-icon" />
                  Time
                </label>
                <input
                  type="time"
                  name="reservationTime"
                  required
                  min="08:00"
                  max="23:00"
                  value={form.reservationTime}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmCancelId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Cancel Reservation</h2>
              <button onClick={cancelCancelReservation} className="modal-close-btn">
                <FaTimes />
              </button>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: '1.1rem' }}>
                Are you sure you want to cancel reservation <span style={{ color: '#fbbf24' }}>#{confirmCancelId}</span>?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button className="cancel-btn" onClick={cancelCancelReservation}>
                  No, Keep
                </button>
                <button className="submit-btn" onClick={confirmCancelReservation}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reservations-container {
          background-color: #000;
          min-height: 100vh;
          color: #fff;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .reservation-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #fff;
        }

        .loading-spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid #fbbf24;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .reservations-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .reservations-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #fbbf24;
          margin: 0 1rem;
        }

        .header-icon {
          font-size: 2rem;
          color: #fbbf24;
        }

        .add-reservation-btn {
          background-color: #fbbf24;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-left: auto;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        .add-reservation-btn:hover {
          background-color: #e6a800;
        }

        .btn-icon {
          margin-right: 0.5rem;
        }

        .reservations-table-container {
          overflow-x: auto;
          margin-top: 1rem;
        }

        .reservations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .reservations-table th {
          background-color: #fbbf24;
          color: #000;
          padding: 1rem;
          text-align: left;
          font-weight: bold;
        }

        .reservations-table td {
          padding: 1rem;
          border-bottom: 1px solid #333;
        }

        .reservations-table tr:hover {
          background-color: #111;
        }

        .th-icon {
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        .cancel-btn {
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

        .cancel-btn:hover {
          background-color: #c11e24;
        }

        .expired-badge {
          color: #999;
          font-size: 0.9rem;
        }

        .no-reservations {
          text-align: center;
          padding: 2rem;
          color: #999;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #222;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          overflow: hidden;
        }

        .modal-header {
          background-color: #fbbf24;
          color: #000;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #000;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .reservation-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #fbbf24;
          font-weight: bold;
        }

        .input-icon {
          margin-right: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background-color: #333;
          border: 1px solid #444;
          border-radius: 4px;
          color: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #fbbf24;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn {
          background-color: #444;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-btn {
          background-color: #fbbf24;
          color: #000;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .submit-btn:hover {
          background-color: #e6a800;
        }

        .status-upcoming {
          color: #fbbf24;
          font-weight: bold;
        }

        .status-completed {
          color: #4ade80;
          font-weight: bold;
        }

        .status-canceled {
          color: #e7272d;
          font-weight: bold;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .reservations-container {
            padding: 1rem;
          }
          
          .reservations-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .add-reservation-btn {
            margin: 1rem 0 0 0;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MyReservations;