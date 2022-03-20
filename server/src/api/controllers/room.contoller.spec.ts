import { Request } from 'express';
import {roomController} from './room.controller';
import WebSocket from 'ws';

class WebSocketMock {
  readyState = 0;
  constructor(url: string) {
    this.readyState = 1;
  }
  close(code?: number, data?: string | Buffer): void {
    this.readyState = 3
  }
  send(data: any, cb?: (err?: Error) => void): void {}
}

describe("RoomController Test Suite", () => {
    const HOST = "ws://localhost:8080/sessions"
    const ROOM_NAME ="082e4f7fdf-js";
    const INTERVIWER_QUERY = `?room=${ROOM_NAME}&user=interviewer`
    const CANDIDATE_QUERY = `?room=${ROOM_NAME}&user=candidate`

    const CANDIDATE_URL = `${HOST}${CANDIDATE_QUERY}`;
    const INTERVIWER_URL = `${HOST}${INTERVIWER_QUERY}`;

    afterEach(() => {
      roomController["rooms"] = {};
    });

    describe("newConnection Test Cases", () => {
        test("It should close the connection if a candidate try to access a room without an interviewer", () => {
            const candidate = new WebSocketMock(CANDIDATE_URL) as WebSocket;
            const closeSpy = jest.spyOn(candidate, 'close');

            roomController.newConnection(candidate, { url: CANDIDATE_URL } as Request)

            expect(closeSpy).toHaveBeenCalled();
            expect(candidate.readyState).toBe(WebSocket.CLOSED);
        });

        test("It should close the connection if a candidate try to access a full room", () => {
            const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;
            const candidate = new WebSocketMock(CANDIDATE_URL) as WebSocket;
            roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request)
            roomController.newConnection(candidate, { url: CANDIDATE_URL } as Request)

            const candidate2 = new WebSocketMock(CANDIDATE_URL) as WebSocket;
            const closeSpy = jest.spyOn(candidate2, 'close');
            roomController.newConnection(candidate2, { url: CANDIDATE_URL } as Request)

            expect(closeSpy).toHaveBeenCalled();
            expect(candidate2.readyState).toBe(WebSocket.CLOSED);
        });

        test("It should create a new room when a interviewer start a session", () => {
            const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;

            roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request);

            expect(roomController['rooms'][ROOM_NAME].length).toBe(1);
        });

        test("It should connect a candidate to a room that have a interviewer", () => {
            const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;
            const candidate = new WebSocketMock(CANDIDATE_URL) as WebSocket;

            roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request);
            roomController.newConnection(candidate, { url: CANDIDATE_URL } as Request);

            expect(roomController['rooms'][ROOM_NAME].length).toBe(2);
        })
    });

    describe("newMessage Test Cases", () => {
        test("It should share message across the room", () => {
          const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;
          const candidate = new WebSocketMock(CANDIDATE_URL) as WebSocket;

          const interviewerSendSpy = jest.spyOn(interviewer, 'send');
          const candidateSendSpy = jest.spyOn(candidate, 'send');

          roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request);
          roomController.newConnection(candidate, { url: CANDIDATE_URL } as Request);

          const message = Buffer.from("Hello");
          roomController.newMessage({ url: CANDIDATE_URL } as Request, message);

          expect(candidateSendSpy).toHaveBeenCalledWith(message);
          expect(interviewerSendSpy).toHaveBeenCalledWith(message);
        });
    });

    describe("exit Test Cases", () => {
        test("It should exclude room if do not have any user", () => {
            const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;
            roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request);

            roomController.exit({ url: INTERVIWER_URL } as Request);

            expect(roomController['rooms'][ROOM_NAME]).toBe(undefined);
        });

        test("It should remove the candidate for a room if the interviewer close the connection", () => {
            const interviewer = new WebSocketMock(INTERVIWER_URL) as WebSocket;
            const candidate = new WebSocketMock(CANDIDATE_URL) as WebSocket;
            const closeSpy = jest.spyOn(candidate, 'close');

            roomController.newConnection(interviewer, { url: INTERVIWER_URL } as Request);
            roomController.newConnection(candidate, { url: CANDIDATE_URL } as Request);

            roomController.exit({ url: INTERVIWER_URL } as Request);

            expect(closeSpy).toHaveBeenCalled();
        });
    });
});