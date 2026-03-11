import sqlite3 from "sqlite3";
import { DB_PATH } from "./config";
import {
  DbMessageRow,
  DbUserRow,
  Message,
  MessagesRepository,
  User,
  UsersRepository,
} from "./types";

sqlite3.verbose();

export interface Repositories {
  messages: MessagesRepository;
  users: UsersRepository;
}

export function createRepositories(): Repositories {
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );

    db.run(
      `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`,
      (err) => {
        // ignore error if column already exists
        if (err && !String(err.message).includes("duplicate column")) {
          console.error("Failed to ensure users.role column:", err);
        }
      }
    );

    db.run(
      `ALTER TABLE users ADD COLUMN phone TEXT`,
      (err) => {
        if (
          err &&
          !String(err.message).toLowerCase().includes("duplicate column")
        ) {
          console.error("Failed to ensure users.phone column:", err);
        }
      }
    );

    db.run(
      `UPDATE users SET role = 'admin' WHERE LOWER(email) = LOWER(?)`,
      ["anattaiv@gmail.com"],
      (err) => {
        if (err) {
          console.error("Failed to promote default admin user:", err);
        }
      }
    );
  });

  const mapMessageRow = (row: DbMessageRow): Message => ({
    id: row.id,
    author: row.author,
    text: row.text,
    createdAt: row.created_at,
  });

  const mapUserRow = (row: DbUserRow): User => ({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    role: row.role ?? "user",
    phone: row.phone ?? null,
  });

  const messages: MessagesRepository = {
    getRecent: (limit = 50): Promise<Message[]> =>
      new Promise((resolve, reject) => {
        db.all<DbMessageRow>(
          "SELECT id, author, text, created_at FROM messages ORDER BY created_at DESC LIMIT ?",
          [limit],
          (err: Error | null, rows: DbMessageRow[]) => {
            if (err) return reject(err);
            resolve(rows.map(mapMessageRow));
          }
        );
      }),

    create: (author: string, text: string): Promise<Message> =>
      new Promise((resolve, reject) => {
        const stmt = db.prepare(
          "INSERT INTO messages (author, text) VALUES (?, ?)"
        );
        stmt.run(
          author,
          text,
          function (this: sqlite3.RunResult, err?: Error | null) {
            if (err) {
              stmt.finalize();
              return reject(err);
            }
            const message: Message = {
              id: this.lastID,
              author,
              text,
              createdAt: new Date().toISOString(),
            };
            stmt.finalize();
            resolve(message);
          }
        );
      }),
  };

  const users: UsersRepository = {
    create: (
      email: string,
      passwordHash: string,
      role: "user" | "admin" | "banned" = "user"
    ): Promise<User> =>
      new Promise((resolve, reject) => {
        const stmt = db.prepare(
          "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"
        );
        stmt.run(
          email.toLowerCase(),
          passwordHash,
          role,
          function (this: sqlite3.RunResult, err?: Error | null) {
            if (err) {
              stmt.finalize();
              return reject(err);
            }
            db.get<DbUserRow>(
              "SELECT id, email, password_hash, role, created_at FROM users WHERE id = ?",
              [this.lastID],
              (getErr: Error | null, row: DbUserRow | undefined) => {
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
              }
            );
          }
        );
      }),

    findByEmail: (email: string): Promise<User | null> =>
      new Promise((resolve, reject) => {
        db.get<DbUserRow>(
          "SELECT id, email, password_hash, role, phone, created_at FROM users WHERE email = ?",
          [email.toLowerCase()],
          (err: Error | null, row: DbUserRow | undefined) => {
            if (err) return reject(err);
            if (!row) return resolve(null);
            resolve(mapUserRow(row));
          }
        );
      }),

    findById: (id: number): Promise<User | null> =>
      new Promise((resolve, reject) => {
        db.get<DbUserRow>(
          "SELECT id, email, password_hash, role, phone, created_at FROM users WHERE id = ?",
          [id],
          (err: Error | null, row: DbUserRow | undefined) => {
            if (err) return reject(err);
            if (!row) return resolve(null);
            resolve(mapUserRow(row));
          }
        );
      }),

    updateProfile: (
      id: number,
      email: string,
      phone: string | null
    ): Promise<User> =>
      new Promise((resolve, reject) => {
        const normalizedEmail = email.toLowerCase();
        const stmt = db.prepare(
          "UPDATE users SET email = ?, phone = ? WHERE id = ?"
        );
        stmt.run(
          normalizedEmail,
          phone,
          id,
          (err: Error | null) => {
            if (err) {
              stmt.finalize();
              return reject(err);
            }
            db.get<DbUserRow>(
              "SELECT id, email, password_hash, role, phone, created_at FROM users WHERE id = ?",
              [id],
              (getErr: Error | null, row: DbUserRow | undefined) => {
                if (getErr) {
                  stmt.finalize();
                  return reject(getErr);
                }
                if (!row) {
                  stmt.finalize();
                  return reject(
                    new Error("User not found after profile update")
                  );
                }
                stmt.finalize();
                resolve(mapUserRow(row));
              }
            );
          }
        );
      }),

    updatePassword: (id: number, newPasswordHash: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const stmt = db.prepare(
          "UPDATE users SET password_hash = ? WHERE id = ?"
        );
        stmt.run(
          newPasswordHash,
          id,
          (err: Error | null) => {
            stmt.finalize();
            if (err) return reject(err);
            resolve();
          }
        );
      }),
  };

  return { messages, users };
}

