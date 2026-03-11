"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.isProduction = exports.REFRESH_TOKEN_TTL = exports.ACCESS_TOKEN_TTL = exports.DB_PATH = exports.PORT = void 0;
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = Number(process.env.PORT) || 4000;
exports.DB_PATH = path_1.default.join(__dirname, "..", "data.db");
// Security-related configuration
exports.ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
exports.REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";
const rawAccessSecret = process.env.ACCESS_TOKEN_SECRET;
const rawRefreshSecret = process.env.REFRESH_TOKEN_SECRET;
exports.isProduction = process.env.NODE_ENV === "production";
exports.ACCESS_TOKEN_SECRET = rawAccessSecret ||
    (exports.isProduction
        ? (() => {
            throw new Error("ACCESS_TOKEN_SECRET environment variable must be set in production");
        })()
        : crypto_1.default.randomBytes(32).toString("hex"));
exports.REFRESH_TOKEN_SECRET = rawRefreshSecret ||
    (exports.isProduction
        ? (() => {
            throw new Error("REFRESH_TOKEN_SECRET environment variable must be set in production");
        })()
        : crypto_1.default.randomBytes(32).toString("hex"));
