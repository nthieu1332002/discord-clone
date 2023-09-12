"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChannelType } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Volume2Icon,
  UserPlus,
  Plus,
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

const CategoryItem = ({ category }: {category: CategoryWithChannels}) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { onOpen } = useModal();
  const onClick = (id: string) => {
    router.push(`/servers/${params?.serverId}/${id}`);
  };
  const onAction = (e: React.MouseEvent, type: ModalType, category: CategoryWithChannels) => {
    e.stopPropagation();
    onOpen(type, {other: category});
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
            const Icon = iconMap[item.type];
            return (
              <div
                key={item.id}
                onClick={() => onClick(item.id)}
                className={cn(
                  "group/item cursor-pointer flex items-center gap-1 rounded-md px-4 py-[0.4rem] text-sm text-zinc-400",
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
                  <UserPlus className={cn("h-4 w-4 ml-auto invisible group-hover/item:visible", params?.channelId === item.id && "visible")} />
                </CustomTooltip>
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

  );
};

export default CategoryItem;
