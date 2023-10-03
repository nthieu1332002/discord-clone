import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";
import useVoiceMemberStore from "./useVoiceMemberStore";
import { ProfileWithChannelId } from "@/types";

const useVoiceMember = () => {
  const { set, add, remove } = useVoiceMemberStore();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('voice-member');
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: ProfileWithChannelId[] = [];

      members.each((member:  ProfileWithChannelId) => initialMembers.push(member));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member:   ProfileWithChannelId) => {
      add(member)
    });

    channel.bind("pusher:member_removed", (member:   ProfileWithChannelId) => {
      remove(member);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('voice-member');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
}

export default useVoiceMember;