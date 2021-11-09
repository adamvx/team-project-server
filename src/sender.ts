import { readFileSync } from 'fs';
import { WebSocket } from 'ws';

const ws = new WebSocket("ws://161.35.216.12:5677");
let i = 0;

ws.on("open", () => {
  console.log("Sender has connected");
  setInterval(() => {
    const dracoData = readFileSync(`./drc/file${i}.drc`);
    ws.send(dracoData);
    i += 1;
    if (i > 120) {
      i = 0;
    }
    console.log(i)
  }, 41);
});
