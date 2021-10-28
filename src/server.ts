import WebSocket, { WebSocketServer } from "ws";

//Web socket server, basic
const wss = new WebSocketServer({
    port: 8080
});

wss.on('connection', (ws) => {
    console.log('New client connected!');

    ws.on('message', (data) => {
        console.log(`Client has send us: ${data}`);

        wss.clients.forEach((client) => {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: true });
            }
        });
    });

    ws.on('close', () => {
        console.log('Client has disconnected!');
    });
});
