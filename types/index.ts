import { Category, Channel } from "@prisma/client";

export type CategoryWithChannels = Category & {
  channels: (Channel[]);
}