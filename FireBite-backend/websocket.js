const WebSocket = require('ws');
const {authenticateUpgrade} = require('./middleware/authMiddleware');
const askAssistant = require('./chatbot');

const wss = new WebSocket.Server({ noServer: true });
const clients = new Map(); // Store connected clients

function setupWebSocket(server) {
  server.on('upgrade', (request, socket, head) => {

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws, request) => {
    console.log('Client connected');

    let authenticated = false;
    let authuser;

    ws.on('message', (message) => {
      try {
        const body = JSON.parse(message);
        console.log('Received:', message.toString());

        if (!authenticated && body.type === 'auth') {
          const token = body.token?.split(' ')[1];
          auth = authenticateUpgrade(token)
          if (auth.valid) {
            authenticated = true;
            authuser = auth.user;
            ws.send(JSON.stringify({ type: "auth_success" }));
          } else {
            ws.send(JSON.stringify({ type: "auth_failure" }));
            ws.close();
          }
          return;
        }
        if(body.type==='message'){
          askAssistant(body.content,ws,authuser.id);
        }
       } catch (error) {
       console.log(error) 
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}


function sendMessage(message, userId) {
  let sent = false;
  
  clients.forEach((user, ws) => {
    if (user.id === userId && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message.toString()));
        sent = true;
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
      }
    }
  });
  
  return sent;
}

module.exports = {
  setupWebSocket,
  sendMessage,
};
