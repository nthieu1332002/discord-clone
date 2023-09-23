"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChannelType, Member, MemberRole } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Volume2Icon,
  UserPlus,
  Plus,
  Settings,
} from "lucide-react";
import CustomTooltip from "../custom-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModalType, useModal } from "@/hooks/useModal";
import { CategoryWithChannels } from "@/types";

export const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.VOICE]: Volume2Icon,
};
type CategoryProps = {
  currentProfile: Member;
  category: CategoryWithChannels;
};

const CategoryItem = ({ category, currentProfile }: CategoryProps) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { onOpen } = useModal();
  const cateName =
    category.name.length > 30
      ? category.name.substring(0, 30) + "..."
      : category.name;

  const onClick = (id: string) => {
    router.push(`/servers/${params?.serverId}/${id}`);
  };
  const onAction = (
    e: React.MouseEvent,
    type: ModalType,
    category: CategoryWithChannels
  ) => {
    e.stopPropagation();
    onOpen(type, { other: category });
  };
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 mb-2"
    >
      <CollapsibleTrigger
        className="w-full cursor-pointer text-black hover:text-gray-700/80 dark:text-gray-400 dark:hover:text-gray-200"
        asChild
      >
        <div className="flex justify-between">
          <span className="flex items-center  text-xs uppercase font-semibold">
            {isOpen ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}

            {cateName}
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
          const Icon = iconMap[item.type];
          const channelName =
            item.name.length > 21
              ? item.name.substring(0, 21) + "..."
              : item.name;

          return (
            <div
              key={item.id}
              onClick={() => onClick(item.id)}
              className={cn(
                "group cursor-pointer flex items-center gap-1 rounded-md px-3 py-[0.4rem] text-sm text-zinc-400",
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
                {channelName}
              </p>
              {currentProfile.role === MemberRole.ADMIN ||
              currentProfile.role === MemberRole.MODERATOR ? (
                <CustomTooltip side="top" align="center" label="Edit Channel">
                  <Settings
                    fill="true"
                    onClick={() => onOpen("editChannel", { channel: item, other: category})}
                    className={cn(
                      "h-4 w-4 ml-auto invisible group-hover:visible dark:group-hover:text-white",
                      params?.channelId === item.id && "visible"
                    )}
                  />
                </CustomTooltip>
              ) : null}
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CategoryItem;
