import express, { Request } from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import { roomController } from './controllers/room.controller';

export const app = express();
const wsApp = expressWs(app);

app.get('/health', (req, res) => res.json({ ok: true }));

wsApp.getWss().on('connection', (ws: WebSocket, req: Request) => roomController.newConnection(ws, req));

// @ts-ignore
app.ws('/sessions', (ws: WebSocket, req: Request) => {
  ws.on('message', (msg: WebSocket.RawData) => roomController.newMessage(req, msg));

  ws.on('close', () => roomController.exit(req));
});
