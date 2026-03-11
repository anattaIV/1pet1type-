"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function generateAccessToken(userId) {
    const options = {};
    return jsonwebtoken_1.default.sign({ sub: userId }, config_1.ACCESS_TOKEN_SECRET, options);
}
function generateRefreshToken(userId) {
    const options = {};
    return jsonwebtoken_1.default.sign({ sub: userId, type: "refresh" }, config_1.REFRESH_TOKEN_SECRET, options);
}
function setRefreshTokenCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: config_1.isProduction,
        sameSite: "lax",
        path: "/api/auth",
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.isProduction,
        sameSite: "lax",
        path: "/api/auth",
    });
}
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "unauthorized" });
    }
    const token = authHeader.slice("Bearer ".length).trim();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
        const sub = decoded.sub;
        if (typeof sub !== "number") {
            return res.status(401).json({ error: "invalid_token_subject" });
        }
        req.userId = sub;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "invalid_or_expired_token" });
    }
}
function registerAuthRoutes(app, users) {
    app.post("/api/auth/register", async (req, res) => {
        const { email, password } = req.body || {};
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password.trim()) {
            return res.status(400).json({ error: "email_and_password_required" });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({ error: "password_too_short", minLength: 8 });
        }
        try {
            const existing = await users.findByEmail(email);
            if (existing) {
                return res.status(409).json({ error: "email_already_in_use" });
            }
            const salt = await bcryptjs_1.default.genSalt(12);
            const hash = await bcryptjs_1.default.hash(password, salt);
            const user = await users.create(email, hash);
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            setRefreshTokenCookie(res, refreshToken);
            res.status(201).json({
                user: { id: user.id, email: user.email },
                accessToken,
            });
        }
        catch (err) {
            console.error("Register error:", err);
            res.status(500).json({ error: "register_failed" });
        }
    });
    app.post("/api/auth/login", async (req, res) => {
        const { email, password } = req.body || {};
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password.trim()) {
            return res.status(400).json({ error: "email_and_password_required" });
        }
        try {
            const user = await users.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: "invalid_credentials" });
            }
            const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!ok) {
                return res.status(401).json({ error: "invalid_credentials" });
            }
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            setRefreshTokenCookie(res, refreshToken);
            res.json({
                user: { id: user.id, email: user.email },
                accessToken,
            });
        }
        catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "login_failed" });
        }
    });
    app.post("/api/auth/refresh", async (req, res) => {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            return res.status(401).json({ error: "refresh_token_missing" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.REFRESH_TOKEN_SECRET);
            const sub = decoded.sub;
            const type = decoded.type;
            if (type !== "refresh" || typeof sub !== "number") {
                return res.status(401).json({ error: "invalid_refresh_token" });
            }
            const user = await users.findById(sub);
            if (!user) {
                return res.status(401).json({ error: "invalid_refresh_token" });
            }
            const newAccessToken = generateAccessToken(user.id);
            const newRefreshToken = generateRefreshToken(user.id);
            setRefreshTokenCookie(res, newRefreshToken);
            res.json({
                user: { id: user.id, email: user.email },
                accessToken: newAccessToken,
            });
        }
        catch (err) {
            console.error("Refresh error:", err);
            clearRefreshTokenCookie(res);
            res.status(401).json({ error: "invalid_or_expired_refresh_token" });
        }
    });
    app.post("/api/auth/logout", (req, res) => {
        clearRefreshTokenCookie(res);
        res.status(204).end();
    });
    app.get("/api/auth/me", async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "unauthorized" });
            return;
        }
        const token = authHeader.slice("Bearer ".length).trim();
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
            const sub = decoded.sub;
            if (typeof sub !== "number") {
                res.status(401).json({ error: "unauthorized" });
                return;
            }
            const user = await users.findById(sub);
            if (!user) {
                res.status(401).json({ error: "unauthorized" });
                return;
            }
            res.json({ id: user.id, email: user.email });
        }
        catch {
            res.status(401).json({ error: "unauthorized" });
        }
    });
}
function createApp(repos, broadcastNewMessage) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", time: new Date().toISOString() });
    });
    registerAuthRoutes(app, repos.users);
    app.get("/api/messages", async (req, res) => {
        try {
            const messages = await repos.messages.getRecent(50);
            res.json(messages);
        }
        catch (err) {
            console.error("DB error:", err);
            res.status(500).json({ error: "db_error" });
        }
    });
    app.post("/api/messages", requireAuth, async (req, res) => {
        const { author, text } = req.body || {};
        if (!author || !text) {
            return res.status(400).json({ error: "author_and_text_required" });
        }
        try {
            const message = await repos.messages.create(author, text);
            broadcastNewMessage(message);
            res.status(201).json(message);
        }
        catch (err) {
            console.error("DB insert error:", err);
            res.status(500).json({ error: "db_insert_error" });
        }
    });
    return app;
}
