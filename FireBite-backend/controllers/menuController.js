const db = require('../db');

// Get all menu items
exports.getAllMenuItems = (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Create a new menu item
exports.createMenuItem = (req, res) => {
  const { itemName, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!itemName || !description || typeof +price !== 'number' || price <= 0 || !image || !category) {
    return res.status(400).json({ message: 'All fields and image are required. Price must be a valid number > 0.' });
  }

  db.query('SELECT * FROM menu WHERE itemName = ?', [itemName], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Menu item with this name already exists.' });
    }

    db.query(
      'INSERT INTO menu (itemName, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
      [itemName, description, price, image, category],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Menu item created successfully' });
      }
    );
  });
};

