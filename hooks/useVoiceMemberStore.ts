
import { ProfileWithChannelId } from '@/types';
import { create } from 'zustand'

interface VoiceMemberStore {
    members: ProfileWithChannelId[];
    add: (profile: ProfileWithChannelId) => void;
    remove: (profile: ProfileWithChannelId) => void;
    set: (profiles: ProfileWithChannelId[]) => void;
}

const useVoiceMemberStore = create<VoiceMemberStore>((set) => ({
    members: [],
    add: (profile) => set((state) => ({ members: [...state.members, profile] })),
    remove: (profile) => set((state) => ({ members: state.members.filter((member) => member.id !== profile.id) })),
    set: (profiles) => set({ members: profiles })
}));

export default useVoiceMemberStore;