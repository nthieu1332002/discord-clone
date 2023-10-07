import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";
import useMember from "./useMember";

const useActiveMember = () => {
  const { set, add, remove } = useMember();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-member');
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id)
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-member');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
}

export default useActiveMember;