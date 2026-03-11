"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const db_1 = require("./db");
const app_1 = require("./app");
const websocket_1 = require("./websocket");
const repos = (0, db_1.createRepositories)();
function bootstrap() {
    const server = http_1.default.createServer();
    const broadcastNewMessage = (0, websocket_1.setupWebSocket)(server);
    const app = (0, app_1.createApp)(repos, broadcastNewMessage);
    server.on("request", app);
    server.listen(config_1.PORT, () => {
        console.log(`Server listening on http://localhost:${config_1.PORT}`);
        console.log(`WebSocket endpoint ws://localhost:${config_1.PORT}/ws`);
    });
}
bootstrap();
