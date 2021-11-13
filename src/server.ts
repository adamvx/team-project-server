import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import WebSocket, { WebSocketServer } from 'ws';
import crypto from 'crypto'

const app = express();
const server = createServer(app);

const rooms: { key: string, socket: WebSocketServer }[] = [];

app.get('/create', (req, res) => {

  const id = crypto.randomBytes(12).toString('hex');
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('New client connected!');

    ws.on('message', (data) => onClinetMessage(wss, ws, data));

    ws.on('close', () => {
      console.log('Client has disconnected!');
    });
  });

  rooms.push({ key: id, socket: wss });
  res.send(id);

})

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = parse(request.url ?? '');

  const room = rooms.find((room) => {
    if (room.key === pathname) {
      return room;
    }
  })

  if (room === undefined) {
    socket.destroy();
    return;
  }

  room.socket.handleUpgrade(request, socket as any, head, function done(ws) {
    room.socket.emit('connection', ws, request);
  });
});

const onClinetMessage = (wss: WebSocketServer, ws: WebSocket, data: WebSocket.RawData) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: true });
    }
  });
}

server.listen(5677);
