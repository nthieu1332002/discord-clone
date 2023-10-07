
import { ChannelType } from '@prisma/client';
import { create } from 'zustand'

interface ChannelStore {
    channelType: ChannelType | null;
    setType: (channeltype: ChannelType) => void;
}

const useChannelStore = create<ChannelStore>((set) =>  ({
    channelType: null,
    setType: (channeltype: ChannelType) => set({channelType: channeltype })
  }));

export default useChannelStore;