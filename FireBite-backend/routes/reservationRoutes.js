const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, ReservationController.createReservation);
router.post('/cancel', authenticateToken, ReservationController.cancelReservation);
router.get('/my', authenticateToken, ReservationController.viewOwnReservations);
router.post('/change-status', authenticateToken, ReservationController.changeStatus); // Admin only

module.exports = router;
