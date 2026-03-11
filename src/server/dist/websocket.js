"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = __importStar(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
let wss = null;
function setupWebSocket(server) {
    wss = new ws_1.WebSocketServer({ server, path: "/ws" });
    wss.on("connection", (socket, request) => {
        var _a;
        // Simple JWT-based auth for WebSocket:
        // the client must pass ?token=<accessToken> in the connection URL.
        try {
            const url = (_a = request.url) !== null && _a !== void 0 ? _a : "";
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
            jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
        }
        catch {
            socket.close(4401, "unauthorized");
            return;
        }
        console.log("WebSocket client connected");
        socket.on("message", (data) => {
            let parsed;
            try {
                parsed = JSON.parse(data.toString());
            }
            catch {
                return;
            }
            if (parsed && parsed.type === "ping") {
                const msg = { type: "pong", time: Date.now() };
                socket.send(JSON.stringify(msg));
            }
        });
        socket.on("close", () => {
            console.log("WebSocket client disconnected");
        });
    });
    const broadcastNewMessage = (message) => {
        if (!wss)
            return;
        const payload = {
            type: "message:new",
            payload: message,
        };
        const data = JSON.stringify(payload);
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(data);
            }
        });
    };
    return broadcastNewMessage;
}
