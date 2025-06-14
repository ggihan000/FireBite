const db = require('../db'); // assuming you have a db.js for MySQL connection

const ReservationController = {
  // Create a new reservation
  createReservation: (req, res) => {
    const userId = req.user.id;
    const { reservationDate, reservationTime, partySize } = req.body;

    const query = `
      INSERT INTO reservations (userId, reservationDate, reservationTime, partySize)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [userId, reservationDate, reservationTime, partySize], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      res.status(201).json({ message: 'Reservation created', reservationId: results.insertId });
    });
  },

  // Cancel reservation (user only for their own reservation)
  cancelReservation: (req, res) => {
    const userId = req.user.id;
    const { reservationId } = req.body;

    const query = `
      UPDATE reservations
      SET status = 'cancelled'
      WHERE id = ? AND userId = ? AND status != 'cancelled'
    `;

    db.query(query, [reservationId, userId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reservation not found or already cancelled' });
      }
      res.json({ message: 'Reservation cancelled' });
    });
  },

  //view reservations (user only for their own reservations)
  viewOwnReservations: (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT id, reservationDate, reservationTime, partySize, status, created_at
        FROM reservations
        WHERE userId = ?
        ORDER BY reservationDate DESC, reservationTime DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        res.json({ reservations: results });
    });
  },

  // Admin only: change reservation status
  changeStatus: (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { reservationId, newStatus } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const query = `
      UPDATE reservations
      SET status = ?
      WHERE id = ?
    `;

    db.query(query, [newStatus, reservationId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json({ message: `Reservation status updated to ${newStatus}` });
    });
  },
};

module.exports = ReservationController;
