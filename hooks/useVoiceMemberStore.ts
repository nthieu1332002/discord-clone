
import { create } from 'zustand'

export type VoiceMember = {
    id: string,
    channelId: string,
}
interface VoiceMemberStore {
    members: VoiceMember[];
    add: (member: VoiceMember) => void;
    remove: (profile: VoiceMember) => void;
    set: (profiles: VoiceMember[]) => void;
}

const useVoiceMemberStore = create<VoiceMemberStore>((set) =>  ({
    members: [],
    add: (member) => set((state) => ({ members: [...state.members, member] })),
    remove: (member) => set((state) => ({ members: state.members.filter((memberId) => memberId !== member) })),
    set: (member) => set({ members: member })
  }));

export default useVoiceMemberStore;