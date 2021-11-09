import { readFileSync } from 'fs';
import { WebSocket } from 'ws';

const ws = new WebSocket("ws://161.35.216.12:5677");
let i = 0;
let t0 = Date.now()
let sum = 0;
let count = 0;

ws.on('message', (data, isBinary) => {
  const t1 = Date.now();
  const delta = t1 - t0;
  sum = sum + delta;
  count = count + 1;
  t0 = t1;
  i += 1;
  if (i > 120) {
    i = 0;
  }
  console.log(i, delta + "ms", (sum / count).toFixed(2) + 'ms')
})