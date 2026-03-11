"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepositories = createRepositories;
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = require("./config");
sqlite3_1.default.verbose();
function createRepositories() {
    const db = new sqlite3_1.default.Database(config_1.DB_PATH);
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
        db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
    const mapMessageRow = (row) => ({
        id: row.id,
        author: row.author,
        text: row.text,
        createdAt: row.created_at,
    });
    const mapUserRow = (row) => ({
        id: row.id,
        email: row.email,
        passwordHash: row.password_hash,
        createdAt: row.created_at,
    });
    const messages = {
        getRecent: (limit = 50) => new Promise((resolve, reject) => {
            db.all("SELECT id, author, text, created_at FROM messages ORDER BY created_at DESC LIMIT ?", [limit], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows.map(mapMessageRow));
            });
        }),
        create: (author, text) => new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO messages (author, text) VALUES (?, ?)");
            stmt.run(author, text, function (err) {
                if (err) {
                    stmt.finalize();
                    return reject(err);
                }
                const message = {
                    id: this.lastID,
                    author,
                    text,
                    createdAt: new Date().toISOString(),
                };
                stmt.finalize();
                resolve(message);
            });
        }),
    };
    const users = {
        create: (email, passwordHash) => new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
            stmt.run(email.toLowerCase(), passwordHash, function (err) {
                if (err) {
                    stmt.finalize();
                    return reject(err);
                }
                db.get("SELECT id, email, password_hash, created_at FROM users WHERE id = ?", [this.lastID], (getErr, row) => {
                    if (getErr) {
                        stmt.finalize();
                        return reject(getErr);
                    }
                    if (!row) {
                        stmt.finalize();
                        return reject(new Error("User not found after insert"));
                    }
                    stmt.finalize();
                    resolve(mapUserRow(row));
                });
            });
        }),
        findByEmail: (email) => new Promise((resolve, reject) => {
            db.get("SELECT id, email, password_hash, created_at FROM users WHERE email = ?", [email.toLowerCase()], (err, row) => {
                if (err)
                    return reject(err);
                if (!row)
                    return resolve(null);
                resolve(mapUserRow(row));
            });
        }),
        findById: (id) => new Promise((resolve, reject) => {
            db.get("SELECT id, email, password_hash, created_at FROM users WHERE id = ?", [id], (err, row) => {
                if (err)
                    return reject(err);
                if (!row)
                    return resolve(null);
                resolve(mapUserRow(row));
            });
        }),
    };
    return { messages, users };
}
