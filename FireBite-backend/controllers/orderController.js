const db = require('../db');
const { client: paypalClient } = require('../utils/paypalClient');
const paypal = require('@paypal/checkout-server-sdk');

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, address, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  const menuIds = items.map(item => item.menuId);

  db.query('SELECT id, price FROM menu WHERE id IN (?)', [menuIds], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const priceMap = {};
    results.forEach(menu => {
      priceMap[menu.id] = menu.price;
    });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const price = priceMap[item.menuId];
      if (!price) {
        return res.status(400).json({ message: `Menu item not found: ID ${item.menuId}` });
      }

      const subtotal = price * item.qty;
      totalAmount += subtotal;
      orderItems.push([item.menuId, item.qty, subtotal]);
    }

    const paymentCompletedAt =  null ;

    const orderInsertQuery = `
      INSERT INTO orders 
      (userId, totalAmount, paymentMethod, paymentCompletedAt, firstName, lastName, country, address, city, state, zip, phone, email, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      userId,
      totalAmount,
      paymentMethod,
      paymentCompletedAt,
      address.firstName,
      address.lastName,
      address.country,
      address.address,
      address.city,
      address.state,
      address.zip,
      address.phone,
      address.email,
      address.notes || ''
    ];

    db.query(orderInsertQuery, orderValues, async (err2, result) => {
      if (err2) return res.status(500).json({ error: err2 });

      const orderId = result.insertId;
      const orderItemsWithOrderId = orderItems.map(item => [orderId, ...item]);

      db.query(
        'INSERT INTO order_items (orderId, menuId, qty, subtotal) VALUES ?',
        [orderItemsWithOrderId],
        async (err3) => {
          if (err3) return res.status(500).json({ error: err3 });

          db.query('DELETE FROM cart_items WHERE userId = ?', [userId], async (err4) => {
            if (err4) console.error('Error clearing cart:', err4);

            // 🚀 Handle PayPal Payment
            if (paymentMethod === 'paypal') {
              try {
                const request = new paypal.orders.OrdersCreateRequest();
                request.prefer("return=representation");
                request.requestBody({
                  intent: 'CAPTURE',
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: totalAmount.toFixed(2)
                    },
                    description: `Order #${orderId}`
                  }],
                  application_context: {
                    return_url: `${process.env.FRONTEND_URL}/paypal/success?orderId=${orderId}`,
                    cancel_url: `${process.env.FRONTEND_URL}/paypal/cancel?orderId=${orderId}`
                  }
                });

                const paypalClient = require('../utils/paypalClient'); // adjust path if needed
                const paypalRes = await paypalClient.client().execute(request);
                const approvalUrl = paypalRes.result.links.find(link => link.rel === 'approve').href;

                return res.status(201).json({
                  message: 'Order created. Redirect to PayPal to complete payment.',
                  orderId,
                  approvalUrl
                });
              } catch (paypalErr) {
                console.error('PayPal Error:', paypalErr);
                return res.status(500).json({ message: 'Error creating PayPal payment' });
              }
            }

            // 💳 Normal payment (bank/cash/etc)
            res.status(201).json({
              message: 'Order placed successfully',
              orderId,
              totalAmount,
              bankDetailsRequired: paymentMethod === 'bank'
            });
          });
        }
      );
    });
  });
};

// Get all orders for current user
exports.getUserOrders = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM orders WHERE userId = ? ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


// 2. Get all orders (for admins)
exports.getAllOrders = (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const query = `
    SELECT o.*, u.name AS customerName
    FROM orders o
    JOIN users u ON o.userId = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get last order for logged-in user
exports.getLastUserOrder = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM orders 
    WHERE userId = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'No orders found' });
    res.json(results[0]);
  });
};

// Update order status (admin only)
exports.updateOrderStatus = (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const query = `
    UPDATE orders SET status = ? WHERE id = ?
  `;

  db.query(query, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Order status updated successfully' });
  });
};

// Mark order as paid (admin only)
exports.markOrderAsPaid = (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { orderId } = req.params;

  const query = `
    UPDATE orders SET paymentCompletedAt = NOW() WHERE id = ?
  `;

  db.query(query, [orderId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Payment marked as completed' });
  });
};
// Get order details by ID (for admins)
exports.getOrderDetailsAdmin = (req, res) => {
  const { orderId } = req.params;

  const query = `
    SELECT o.*, u.name AS customerName, u.email AS customerEmail
    FROM orders o
    JOIN users u ON o.userId = u.id
    WHERE o.id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = results[0];

    // Fetch order items
    db.query('SELECT * FROM order_items WHERE orderId = ?', [orderId], (err2, items) => {
      if (err2) return res.status(500).json({ error: err2 });

      order.items = items;
      res.json(order);
    });
  });
};

// Get order details by ID (for users)
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const orderQuery = `SELECT * FROM orders WHERE id = ? AND userId = ?`;
  const itemsQuery = `
    SELECT oi.qty, oi.subtotal, m.itemName, m.price, m.image
    FROM order_items oi
    JOIN menu m ON oi.menuId = m.id
    WHERE oi.orderId = ?
  `;

  db.query(orderQuery, [orderId, userId], (err, orderResults) => {
    if (err || orderResults.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = orderResults[0];

    db.query(itemsQuery, [orderId], (err, itemResults) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch items' });

      res.json({ order, items: itemResults });
    });
  });
};

// Capture PayPal order and update local order record
exports.capturePaypalOrder = async (req, res) => {
  const { paypalOrderId, localOrderId } = req.body;

  if (!paypalOrderId || !localOrderId) {
    return res.status(400).json({ message: 'Missing PayPal or Local Order ID' });
  }

  try {
    // Capture PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const capture = await paypalClient().execute(request);

    const status = capture.result.status;
    const completedAt = new Date();

    if (status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment not completed', status });
    }

    // Update local order record
    db.query(
      'UPDATE orders SET paymentCompletedAt = ? WHERE id = ?',
      [completedAt, localOrderId],
      (err, result) => {
        if (err) {
          console.error('DB Update Error:', err);
          return res.status(500).json({ message: 'Database update failed' });
        }

        return res.status(200).json({
          message: 'Payment captured and order updated successfully',
          status,
          captureId: capture.result.id
        });
      }
    );
  } catch (err) {
    console.error('PayPal Capture Error:', err);
    return res.status(500).json({ message: 'PayPal capture failed', error: err });
  }
};

// Cancel PayPal order
exports.cancelPaypalOrder = (req, res) => {
  //cancel leatest order where payment method is paypal, paymentCompletedAt  is null and user id is same as logged in user
  const userId = req.user.id;
  const query = `
    UPDATE orders 
    SET status = 'cancelled', paymentCompletedAt = NULL 
    WHERE userId = ? AND paymentMethod = 'paypal' AND paymentCompletedAt IS NULL 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('DB Update Error:', err);
      return res.status(500).json({ message: 'Database update failed' });
    }

    return res.status(200).json({ message: 'PayPal order cancelled successfully' });
  });
};