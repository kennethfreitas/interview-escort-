import { Request } from 'express';
import WebSocket from 'ws';

interface WsConnection {
  user: UserType;
  ws: WebSocket;
}

interface Room {
  [roomName: string]: WsConnection[];
}

enum UserType {
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate',
}

class RoomController {
  private rooms: Room = {};

  newConnection(ws: WebSocket, req: Request): void {
    const [roomName, user] = this.getRoomNameAndUser(req.url!);

    if (!this.rooms[roomName]) this.rooms[roomName] = [];

    const hasInterviewerInRoom = this.rooms[roomName].some(({ user }) => user === UserType.INTERVIEWER);
    const isSessionFull = this.rooms[roomName].length >= 2;
    if ((user === UserType.CANDIDATE && !hasInterviewerInRoom) || isSessionFull) {
      ws.close();
      return;
    }

    this.rooms[roomName].push({ user, ws });
  };

  newMessage(req: Request, msg: WebSocket.RawData): void {
    const [roomName] = this.getRoomNameAndUser(req.url);
    this.rooms[roomName].forEach(({ ws }) => {
      if (ws.readyState === 1) ws.send(msg);
    });
  };

  exit(req: Request): void {
    const [roomName, user] = this.getRoomNameAndUser(req.url);
    this.rooms[roomName] = this.rooms[roomName].filter(el => el.user !== user);

    if (user === UserType.INTERVIEWER) this.rooms[roomName].forEach(user => user.ws.close());

    if (!this.rooms[roomName].length) delete this.rooms[roomName];
  };

  private getRoomNameAndUser(wsUrl: string): [string, UserType] {
    return wsUrl
      .split('?')[1]
      .split('&')
      .map(el => el.split('=')[1]) as [string, UserType];
  }
}

export const roomController = new RoomController();
