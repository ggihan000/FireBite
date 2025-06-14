const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');

  // Create users table
  connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      phone VARCHAR(20),
      password VARCHAR(255)
    )
  `);

  // Create menu table
  connection.query(`
    CREATE TABLE IF NOT EXISTS menu (
      id INT AUTO_INCREMENT PRIMARY KEY,
      itemName VARCHAR(100),
      description TEXT,
      price DECIMAL(10, 2),
      image VARCHAR(255),
      category VARCHAR(100)
    )
  `);

  // Create orders table
  connection.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    totalAmount DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    paymentMethod ENUM('paypal', 'cash', 'bank') DEFAULT 'cash',
    paymentCompletedAt DATETIME DEFAULT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    country VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Create order_items intermediate table
  connection.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT,
      menuId INT,
      qty INT,
      subtotal DECIMAL(10, 2),
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (menuId) REFERENCES menu(id)
    )
  `);
  // Create cart_items table
  connection.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      menuId INT,
      qty INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (menuId) REFERENCES menu(id),
      UNIQUE KEY unique_user_menu (userId, menuId)
    )
  `);

  // Create reservations table
  connection.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      reservationDate DATE,
      reservationTime TIME,
      partySize INT,
      status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);


  console.log('Ensured all necessary tables exist.');
});

module.exports = connection;
