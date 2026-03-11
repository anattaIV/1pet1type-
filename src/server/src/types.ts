export interface Message {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: string;
  role: "user" | "admin" | "banned";
  phone: string | null;
}

export interface DbUserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
  role: "user" | "admin" | "banned";
  phone: string | null;
}

export interface DbMessageRow {
  id: number;
  author: string;
  text: string;
  created_at: string;
}

export type ServerToClientMessage =
  | { type: "message:new"; payload: Message }
  | { type: "pong"; time: number };

export type ClientToServerMessage = { type: "ping" };

export interface MessagesRepository {
  getRecent(limit?: number): Promise<Message[]>;
  create(author: string, text: string): Promise<Message>;
}

export type BroadcastNewMessage = (message: Message) => void;

export interface UsersRepository {
  create(email: string, passwordHash: string, role?: "user" | "admin" | "banned"): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  updateProfile(
    id: number,
    email: string,
    phone: string | null
  ): Promise<User>;
  updatePassword(id: number, newPasswordHash: string): Promise<void>;
}


