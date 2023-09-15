import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Category, Channel, Member, Message, Profile } from "@prisma/client";

export type CategoryWithChannels = Category & {
  channels: (Channel[]);
}

export type SocketIOResponse = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  }
}