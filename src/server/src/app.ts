import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { BroadcastNewMessage, UsersRepository } from "./types";
import { Repositories } from "./db";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, isProduction } from "./config";

interface AuthRequest extends Request {
  userId?: number;
}

function generateAccessToken(userId: number): string {
  const options: SignOptions = {};
  return jwt.sign({ sub: userId }, ACCESS_TOKEN_SECRET, options);
}

function generateRefreshToken(userId: number): string {
  const options: SignOptions = {};
  return jwt.sign({ sub: userId, type: "refresh" }, REFRESH_TOKEN_SECRET, options);
}

function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });
}

function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const sub = decoded.sub;
    if (typeof sub !== "number") {
      return res.status(401).json({ error: "invalid_token_subject" });
    }
    req.userId = sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_or_expired_token" });
  }
}

function registerAuthRoutes(app: Express, users: UsersRepository) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
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

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);

      const user = await users.create(email, hash);

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        accessToken,
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "register_failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({ error: "email_and_password_required" });
    }

    try {
      const user = await users.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "invalid_credentials" });
      }

      if (user.role === "banned") {
        return res.status(403).json({ error: "account_banned" });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ error: "invalid_credentials" });
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      setRefreshTokenCookie(res, refreshToken);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        accessToken,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "login_failed" });
    }
  });

  app.post("/api/auth/refresh", async (req: Request, res: Response) => {
    const token = (req as any).cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "refresh_token_missing" });
    }

    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
      const sub = decoded.sub;
      const type = (decoded as any).type;

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
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        accessToken: newAccessToken,
      });
    } catch (err) {
      console.error("Refresh error:", err);
      clearRefreshTokenCookie(res);
      res.status(401).json({ error: "invalid_or_expired_refresh_token" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    clearRefreshTokenCookie(res);
    res.status(204).end();
  });

  app.get(
    "/api/auth/me",
    async (req: AuthRequest, res: Response): Promise<void> => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }

      const token = authHeader.slice("Bearer ".length).trim();
      try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
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
        res.json({
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
        });
      } catch {
        res.status(401).json({ error: "unauthorized" });
      }
    }
  );

  app.post(
    "/api/user/update-profile",
    requireAuth,
    async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }

      const { email, phone, currentPassword } = req.body || {};

      if (
        typeof email !== "string" ||
        typeof currentPassword !== "string" ||
        !email.trim() ||
        !currentPassword.trim()
      ) {
        res.status(400).json({ error: "email_and_password_required" });
        return;
      }

      const normalizedPhone =
        typeof phone === "string" && phone.trim() ? phone.trim() : null;

      try {
        const user = await users.findById(userId);
        if (!user) {
          res.status(404).json({ error: "user_not_found" });
          return;
        }

        if (user.role === "banned") {
          res.status(403).json({ error: "account_banned" });
          return;
        }

        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok) {
          res.status(401).json({ error: "invalid_password" });
          return;
        }

        const existingWithEmail =
          email.toLowerCase() !== user.email.toLowerCase()
            ? await users.findByEmail(email)
            : null;
        if (existingWithEmail) {
          res.status(409).json({ error: "email_already_in_use" });
          return;
        }

        const updated = await users.updateProfile(
          user.id,
          email,
          normalizedPhone
        );

        res.json({
          id: updated.id,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
        });
      } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ error: "update_profile_failed" });
      }
    }
  );

  app.post(
    "/api/user/update-password",
    requireAuth,
    async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }

      const { currentPassword, newPassword } = req.body || {};

      if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        !currentPassword.trim() ||
        !newPassword.trim()
      ) {
        res.status(400).json({ error: "passwords_required" });
        return;
      }

      if (newPassword.length < 8) {
        res
          .status(400)
          .json({ error: "password_too_short", minLength: 8 });
        return;
      }

      try {
        const user = await users.findById(userId);
        if (!user) {
          res.status(404).json({ error: "user_not_found" });
          return;
        }

        if (user.role === "banned") {
          res.status(403).json({ error: "account_banned" });
          return;
        }

        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok) {
          res.status(401).json({ error: "invalid_password" });
          return;
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(newPassword, salt);

        await users.updatePassword(user.id, hash);

        res.status(204).end();
      } catch (err) {
        console.error("Update password error:", err);
        res.status(500).json({ error: "update_password_failed" });
      }
    }
  );
}

export function createApp(
  repos: Repositories,
  broadcastNewMessage: BroadcastNewMessage
): Express {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  registerAuthRoutes(app, repos.users);

  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const messages = await repos.messages.getRecent(50);
      res.json(messages);
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: "db_error" });
    }
  });

  app.post(
    "/api/messages",
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      const { author, text } = req.body || {};
      if (!author || !text) {
        return res.status(400).json({ error: "author_and_text_required" });
      }

      try {
        const message = await repos.messages.create(author, text);
        broadcastNewMessage(message);
        res.status(201).json(message);
      } catch (err) {
        console.error("DB insert error:", err);
        res.status(500).json({ error: "db_insert_error" });
      }
    }
  );

  return app;
}

