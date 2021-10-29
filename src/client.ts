import { readFileSync } from 'fs';
import { WebSocket } from 'ws';

const ws = new WebSocket("ws://localhost:8080");
const dracoData = readFileSync('./drc/file0.drc');

console.log(dracoData);

ws.addEventListener("open", () => {
  console.log("we are connected");
  setInterval(() => {
    ws.send(dracoData);
  }, 33);
});

ws.addEventListener("message", (e) => {
  const result = e.data;
  console.log(result);
});