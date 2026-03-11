import http from "http";
import { PORT } from "./config";
import { createRepositories } from "./db";
import { createApp } from "./app";
import { setupWebSocket } from "./websocket";

const repos = createRepositories();

function bootstrap() {
  const server = http.createServer();

  const broadcastNewMessage = setupWebSocket(server);
  const app = createApp(repos, broadcastNewMessage);

  server.on("request", app);

  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`WebSocket endpoint ws://localhost:${PORT}/ws`);
  });
}

bootstrap();

