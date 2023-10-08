"use client";
import React, { useCallback, useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Channel,
  ChannelType,
  Member,
  MemberRole,
  Profile,
} from "@prisma/client";
import CustomTooltip from "../custom-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModalType, useModal } from "@/hooks/useModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Volume2Icon,
  Plus,
  Settings,
} from "lucide-react";
import { CategoryWithChannels } from "@/types";
import VoiceList from "./VoiceList";
import useVoiceMemberStore, { VoiceMember } from "@/hooks/useVoiceMemberStore";
import { pusherClient } from "@/lib/pusher";
import { Channel as ChannelPusher } from "pusher-js";
import { PlayUserJoinSound, PlayUserLeaveSound } from "../PlayMessageSound";

type Props = {
  categories: CategoryWithChannels[];
  currentProfile: Member;
  members: (Member & {
    profile: Profile;
  })[];
};
const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.VOICE]: Volume2Icon,
};

type pusherOnline = {
  onlineUsersArray: VoiceMember[];
  channelId: string;
  id: string;
};

const CategoryList = ({ categories, currentProfile, members }: Props) => {
  const { serverId, channelId } = useParams() ?? {};
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { onOpen } = useModal();
  const { members: voiceMembers, set } = useVoiceMemberStore();

  const [activeChannel, setActiveChannel] = useState<ChannelPusher | null>(
    null
  );

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("my-channel");
      setActiveChannel(channel);
    }

    channel.bind("online-users-added", (data: pusherOnline) => {
      set(data.onlineUsersArray);
    });
    channel.bind("online-users-removed", (data: pusherOnline) => {
      set(data.onlineUsersArray);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("my-channel");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set]);

  const onChangeChannel = useCallback(
    (channel: Channel) => {
      router.push(`/servers/${serverId}/${channel.id}`);
    },
    [router, serverId]
  );

  const onAction = useCallback(
    (e: React.MouseEvent, type: ModalType, category: CategoryWithChannels) => {
      e.stopPropagation();
      onOpen(type, { other: category });
    },
    [onOpen]
  );

  return (
    <ScrollArea className="p-3">
      {categories.map((category) => {
        return (
          <Collapsible
            key={category.id}
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2 mb-2"
          >
            <CollapsibleTrigger
              className="w-full cursor-pointer text-black hover:text-gray-700/80 dark:text-gray-400 dark:hover:text-gray-200"
              asChild
            >
              <div className="flex justify-between">
                <span className="flex items-center truncate text-xs uppercase font-semibold">
                  {isOpen ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}

                  {category.name}
                </span>
                <CustomTooltip side="top" align="center" label="Create Channel">
                  <Plus
                    className="h-4 w-4"
                    onClick={(e) => onAction(e, "createChannel", category)}
                  />
                </CustomTooltip>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-1">
              {category.channels.map((item) => {
                const Icon = IconMap[item.type];
                const channelName =
                  item.name.length > 21
                    ? item.name.substring(0, 21) + "..."
                    : item.name;
                const filteredMembers = members.filter((member) => {
                  const v = voiceMembers.find(
                    (vm) => vm.id === member.profileId
                  );
                  return v && v.channelId === item.id;
                });
                return (
                  <React.Fragment key={item.id}>
                    <div
                      onClick={() => onChangeChannel(item)}
                      className={cn(
                        "group cursor-pointer flex items-center gap-1 rounded-md px-3 py-[0.4rem] text-sm text-zinc-400",
                        channelId === item.id
                          ? "bg-zinc-700/20 dark:bg-zinc-700"
                          : "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                      )}
                    >
                      <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <p
                        className={cn(
                          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                          channelId === item.id &&
                            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                        )}
                      >
                        {channelName}
                      </p>
                      {currentProfile.role === MemberRole.ADMIN ||
                      currentProfile.role === MemberRole.MODERATOR ? (
                        <CustomTooltip
                          side="top"
                          align="center"
                          label="Edit Channel"
                        >
                          <Settings
                            fill="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen("editChannel", {
                                channel: item,
                                other: category,
                              });
                            }}
                            className={cn(
                              "h-4 w-4 ml-auto invisible group-hover:visible dark:group-hover:text-white",
                              channelId === item.id && "visible"
                            )}
                          />
                        </CustomTooltip>
                      ) : null}
                    </div>
                    {item.type === ChannelType.VOICE &&
                    filteredMembers.length > 0 ? (
                      <VoiceList members={filteredMembers} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </ScrollArea>
  );
};

export default CategoryList;
