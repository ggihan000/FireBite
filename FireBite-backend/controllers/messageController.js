const WebSocket = require('ws');

// Create WebSocket server that handles upgrades manually
const wss = new WebSocket.Server({ noServer: true });

// Store active connections
const activeConnections = new Map();

wss.on('connection', (ws, request) => {
  const user = request.user;
  
  // Store connection by user ID
  activeConnections.set(user.id, ws);
  
  console.log(`User connected: ${user.name} (${user.id})`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'success',
    message: `Welcome ${user.name}!`,
    userId: user.id
  }));
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`Message from ${user.id}:`, message);
      
      // Handle different message types
      switch(message.type) {
        case 'chat':
          handleChatMessage(user, message);
          break;
        case 'order':
          handleOrderUpdate(user, message);
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (err) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  // Handle disconnections
  ws.on('close', () => {
    activeConnections.delete(user.id);
    console.log(`User disconnected: ${user.name}`);
  });
});

// Handle chat messages
function handleChatMessage(sender, message) {
  const recipient = activeConnections.get(message.recipientId);
  
  if (recipient && recipient.readyState === WebSocket.OPEN) {
    recipient.send(JSON.stringify({
      type: 'chat',
      from: sender.id,
      name: sender.name,
      text: message.text,
      timestamp: Date.now()
    }));
  }
}

// Handle order updates
function handleOrderUpdate(user, message) {
  // Broadcast to admins
  broadcastToAdmins({
    type: 'order-update',
    userId: user.id,
    orderId: message.orderId,
    status: message.status
  });
}

// Send message to specific user
function sendToUser(userId, message) {
  const ws = activeConnections.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Broadcast to all admin users
function broadcastToAdmins(message) {
  activeConnections.forEach((ws, userId) => {
    // In real app, check if user is admin
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// Export the upgrade handler
module.exports = (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
};

// Export messaging functions
module.exports.sendToUser = sendToUser;
module.exports.broadcastToAdmins = broadcastToAdmins;