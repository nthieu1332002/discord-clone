import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from 'zustand';

export type ModalType = "createServer" | "editServer" | "deleteServer" | "leaveServer" | "invite" | "members" | "createCategory" | "editCategory"
  | "deleteCategory" | "createChannel" | "editChannel"
  | "deleteChannel" | "messageFile" | "deleteMessage";

type ModalData = {
  server?: Server;
  channel?: Channel;
  channelName?: string;
  apiUrl?: string;
  query?: Record<string, any>;
  other?: any;
}

type ModalProps = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalProps>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));

