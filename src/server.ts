import WebSocket, { WebSocketServer } from "ws";

//Web socket server, basic
const wss = new WebSocketServer({
  port: 5677
});

wss.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', (data) => onClinetMessage(ws, data));

  ws.on('close', () => {
    console.log('Client has disconnected!');
  });
});

const onClinetMessage = (ws: WebSocket, data: WebSocket.RawData) => {
  console.log(`Client has send us: ${data}`);

  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: true });
    }
  });
}

