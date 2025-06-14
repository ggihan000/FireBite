const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

//simple get route to get the server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/uploads', express.static('uploads'));

setupWebSocket(server); 

server.listen(port, () => {
  console.log(`HTTP & WebSocket server running at http://localhost:${port}`);
});
