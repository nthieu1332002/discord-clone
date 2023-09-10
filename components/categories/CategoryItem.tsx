"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Channel, ChannelType } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Volume2Icon,
  Video,
  UserPlus,
  Plus,
} from "lucide-react";
import CustomTooltip from "../custom-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModalType, useModal } from "@/hooks/useModal";
type CategoryItemProps = {
  name: string;
  channels: Channel[];
};
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Volume2Icon,
  [ChannelType.VIDEO]: Video,
};

const CategoryItem = ({ name, channels }: CategoryItemProps) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const {onOpen} = useModal();
  console.log("params", params);
  const onClick = (id: string) => {
    console.log("id", id);
    router.push(`/servers/${params?.serverId}/${id}`);
  };
  const onAction = (e: React.MouseEvent, type: ModalType) => {
    e.stopPropagation();
    // onOpen(type, {channel, server})
  };
  return (
    <div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <CollapsibleTrigger className="w-full cursor-pointer" asChild>
          <div className="flex justify-between ">
            <span className="flex  items-center text-black dark:text-gray-400 dark:hover:text-gray-200 text-xs uppercase font-semibold">
              {isOpen ? (
                <ChevronDown className="h-3 w-3 mr-1" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-1" />
              )}
              {name}
            </span>
            <CustomTooltip side="top" align="center" label="Create Channel">
              <Plus
                className="h-4 w-4"
                onClick={(e) => onAction(e, "createChannel")}
              />
            </CustomTooltip>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2">
          {channels.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <div
                key={item.id}
                onClick={() => onClick(item.id)}
                className={cn(
                  "cursor-pointer flex items-center gap-1 rounded-md px-4 py-2 text-sm text-zinc-400",
                  params?.channelId === item.id
                    ? "bg-zinc-700/20 dark:bg-zinc-700"
                    : "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                )}
              >
                <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p
                  className={cn(
                    "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.channelId === item.id &&
                      "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                  )}
                >
                  {item.name}
                </p>
                <CustomTooltip side="top" align="center" label="Create Invite">
                  <UserPlus className="h-4 w-4 ml-auto" />
                </CustomTooltip>
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CategoryItem;
