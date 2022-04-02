import { readFileSync } from "fs";
import { WebSocket } from "ws";

(async () => {
	const id = "0000-0000-0000";
	console.log("Room id:", id);

	const ws = new WebSocket(`ws://38.242.238.119:5677/${id}`);
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
})();
