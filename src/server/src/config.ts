import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;

export const DB_PATH = path.join(__dirname, "..", "data.db");

// Security-related configuration
export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
export const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

const rawAccessSecret = process.env.ACCESS_TOKEN_SECRET;
const rawRefreshSecret = process.env.REFRESH_TOKEN_SECRET;

export const isProduction = process.env.NODE_ENV === "production";

export const ACCESS_TOKEN_SECRET: string =
  rawAccessSecret ||
  (isProduction
    ? (() => {
        throw new Error(
          "ACCESS_TOKEN_SECRET environment variable must be set in production"
        );
      })()
    : crypto.randomBytes(32).toString("hex"));

export const REFRESH_TOKEN_SECRET: string =
  rawRefreshSecret ||
  (isProduction
    ? (() => {
        throw new Error(
          "REFRESH_TOKEN_SECRET environment variable must be set in production"
        );
      })()
    : crypto.randomBytes(32).toString("hex"));

