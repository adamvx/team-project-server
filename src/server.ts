import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { generateId } from "./utils";

type TRoom = {
	key: string;
	socket: WebSocketServer;
};

const app = express();
const server = createServer(app);

let rooms: TRoom[] = [createRoom("0000-0000-0000")];

app.get("/create", (req, res) => {
	const room = createRoom();
	rooms.push(room);
	res.json({ id: room.key });
});

function createRoom(defaultId?: string): TRoom {
	const id = defaultId || generateId();
	const wss = new WebSocketServer({ noServer: true });

	wss.on("connection", (ws) => {
		console.log(`New client connected on server with id: ${id}!`);

		ws.on("message", (data) => onClinetMessage(wss, ws, data));

		ws.on("close", () => {
			console.log(`Client has disconnected on server with id: ${id}!`);
			// TOOD: Termination and deletion of unused server will be added later
			// if (wss.clients.size === 0) {
			// 	console.log(
			// 		`All client has disconnected terminating server with id: ${id}!`
			// 	);
			// 	wss.close();
			// 	rooms = rooms.filter(x => x.key !== id)
			// }
		});
	});
	return { key: id, socket: wss };
}

server.on("upgrade", function upgrade(request, socket, head) {
	const room = rooms.find((room) => {
		if (room.key === request.url?.replace("/", "")) {
			return room;
		}
	});

	if (room === undefined) {
		socket.destroy();
		return;
	}

	room.socket.handleUpgrade(request, socket as any, head, function done(ws) {
		room.socket.emit("connection", ws, request);
	});
});

const onClinetMessage = (
	wss: WebSocketServer,
	ws: WebSocket,
	data: WebSocket.RawData
) => {
	wss.clients.forEach((client) => {
		if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(data, { binary: true });
		}
	});
};

server.listen(5677, () => {
	console.log("🚀 Server is running!");
});
