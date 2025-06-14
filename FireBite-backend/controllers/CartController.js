const db = require('../db'); // adjust path to your DB connection file

// Helper: Get item price
const getMenuItem = (menuId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM menu WHERE id = ?', [menuId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const addToCart = (req, res) => {
  const userId = req.user.id;
  const { menuId } = req.body;
  db.query(
    'SELECT * FROM cart_items WHERE userId = ? AND menuId = ?',
    [userId, menuId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (results.length > 0) {
        db.query(
          'UPDATE cart_items SET qty = qty + 1 WHERE userId = ? AND menuId = ?',
          [userId, menuId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Update error' });
            res.json({ message: 'Quantity increased' });
          }
        );
      } else {
        db.query(
          'INSERT INTO cart_items (userId, menuId, qty) VALUES (?, ?, 1)',
          [userId, menuId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Insert error' });
            res.json({ message: 'Item added to cart' });
          }
        );
      }
    }
  );
};

const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { menuId } = req.body;
  db.query(
    'DELETE FROM cart_items WHERE userId = ? AND menuId = ?',
    [userId, menuId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Delete error' });
      res.json({ message: 'Item removed' });
    }
  );
};

const increaseQty = (req, res) => {
  const userId = req.user.id;
  const { menuId } = req.body;
  db.query(
    'UPDATE cart_items SET qty = qty + 1 WHERE userId = ? AND menuId = ?',
    [userId, menuId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Increase error' });
      res.json({ message: 'Quantity increased' });
    }
  );
};

const decreaseQty = (req, res) => {
  const userId = req.user.id;
  const { menuId } = req.body;
  db.query(
    'SELECT qty FROM cart_items WHERE userId = ? AND menuId = ?',
    [userId, menuId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error' });
      if (results.length === 0) return res.status(404).json({ message: 'Item not in cart' });
      const qty = results[0].qty;
      if (qty <= 1) {
        db.query(
          'DELETE FROM cart_items WHERE userId = ? AND menuId = ?',
          [userId, menuId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Delete error' });
            res.json({ message: 'Item removed from cart' });
          }
        );
      } else {
        db.query(
          'UPDATE cart_items SET qty = qty - 1 WHERE userId = ? AND menuId = ?',
          [userId, menuId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Decrease error' });
            res.json({ message: 'Quantity decreased' });
          }
        );
      }
    }
  );
};

const getCart = (req, res) => {
  const userId = req.user.id;
  db.query(
    'SELECT ci.menuId, ci.qty, m.itemName, m.price, m.image, m.description FROM cart_items ci JOIN menu m ON ci.menuId = m.id WHERE ci.userId = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Fetch error' });
      const cartItems = results.map(item => {
        const subtotal = item.price * item.qty;
        return {
          menuId: item.menuId,
          name: item.itemName,
          price: item.price,
          qty: item.qty,
          image: item.image,
          description: item.description,
          subtotal
        };
      });
      const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
      res.json({ items: cartItems, total });
    }
  );
};

// updateCart function to update quantities in the cart , requst will have item id and quantity
const updateCart = (req, res) => {
  const userId = req.user.id;
  const items = req.body.items; // [{ menuId: 1, qty: 2 }, ...]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  const queries = items.map(item => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO cart_items (userId, menuId, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = ?',
        [userId, item.menuId, item.qty, item.qty],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });

  Promise.all(queries)
    .then(() => res.json({ message: 'Cart updated successfully' }))
    .catch(err => res.status(500).json({ message: 'Update error', error: err }));
};

module.exports = {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  getCart,
  updateCart
};
