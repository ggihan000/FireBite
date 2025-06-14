const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, CartController.addToCart);
router.delete('/remove', authenticateToken, CartController.removeFromCart);
router.post('/increase', authenticateToken, CartController.increaseQty);
router.post('/decrease', authenticateToken, CartController.decreaseQty);
router.get('/', authenticateToken, CartController.getCart);
router.post('/updatecart', authenticateToken, CartController.updateCart);

module.exports = router;
