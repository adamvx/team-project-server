import axios from 'axios';
import { readFileSync } from 'fs';
import { WebSocket } from 'ws';

(async () => {
  const res = await axios.get('http://161.35.216.12:5677/create')
  const id = res.data.id
  console.log("Room id:", id)

  const ws = new WebSocket(`ws://161.35.216.12:5677/${id}`);
  let i = 0;

  ws.on("open", () => {
    console.log("Sender has connected and sending data");
    setInterval(() => {
      const dracoData = readFileSync(`./drc/file${i}.drc`);
      ws.send(dracoData);
      i += 1;
      if (i > 120) {
        i = 0;
      }
    }, 41);
  });

})()


