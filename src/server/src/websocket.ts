import { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import {
  BroadcastNewMessage,
  ClientToServerMessage,
  Message,
  ServerToClientMessage,
} from "./types";
import { ACCESS_TOKEN_SECRET } from "./config";

let wss: WebSocketServer | null = null;

export function setupWebSocket(server: HttpServer): BroadcastNewMessage {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket: WebSocket, request) => {
    // Simple JWT-based auth for WebSocket:
    // the client must pass ?token=<accessToken> in the connection URL.
    try {
      const url = request.url ?? "";
      const queryIndex = url.indexOf("?");
      if (queryIndex === -1) {
        socket.close(4401, "unauthorized");
        return;
      }
      const query = new URLSearchParams(url.substring(queryIndex + 1));
      const token = query.get("token");
      if (!token) {
        socket.close(4401, "unauthorized");
        return;
      }
      jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
      socket.close(4401, "unauthorized");
      return;
    }

    console.log("WebSocket client connected");

    socket.on("message", (data: WebSocket.RawData) => {
      let parsed: ClientToServerMessage | undefined;
      try {
        parsed = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (parsed && parsed.type === "ping") {
        const msg: ServerToClientMessage = { type: "pong", time: Date.now() };
        socket.send(JSON.stringify(msg));
      }
    });

    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  const broadcastNewMessage: BroadcastNewMessage = (message: Message) => {
    if (!wss) return;
    const payload: ServerToClientMessage = {
      type: "message:new",
      payload: message,
    };
    const data = JSON.stringify(payload);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  return broadcastNewMessage;
}

