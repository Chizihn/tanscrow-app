// assets\types\chat.ts

import { User } from "./user";

export interface Attachment {
  readonly id: string;
  url: string;
  fileType: string;
  fileName: string;
}

export interface Message {
  readonly id: string;
  sender: Partial<User>;
  content: string;
  attachments: Attachment[];
  isRead: boolean;
  createdAt: Date;
}

export interface LastMessage {
  content?: string | null;
  sender?: User;
  isRead?: boolean;
  createdAt?: Date;
  messageType?: string | null;
}

export interface Chat {
  readonly id: string;
  participants: Partial<User[]>;
  lastMessage?: LastMessage | null;
  lastMessageAt: Date;
  readonly createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export type Chats = Chat[];
