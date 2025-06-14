const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/admin', authenticateToken, orderController.getAllOrders);
router.get('/last', authenticateToken, orderController.getLastUserOrder);
router.patch('/admin/:orderId/status', authenticateToken, orderController.updateOrderStatus);
router.patch('/admin/:orderId/mark-paid', authenticateToken, orderController.markOrderAsPaid);
router.get('/admin/:orderId', authenticateToken, orderController.getOrderDetailsAdmin);
router.get('/:id', authenticateToken, orderController.getOrderDetails);
router.post('/paypal/success', authenticateToken, orderController.capturePaypalOrder);
router.post('/paypal/cancel', authenticateToken, orderController.cancelPaypalOrder);

module.exports = router;
