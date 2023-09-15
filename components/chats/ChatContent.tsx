"use client";
import { useChatScroll } from "@/hooks/useChatScroll";
import { Channel, ChannelType } from "@prisma/client";
import { Hash } from "lucide-react";
import React, { ElementRef, useRef } from "react";

type Props = {
  channel: Channel;
};

const ChatContent = ({ channel }: Props) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  useChatScroll({
    chatRef,
    bottomRef,
    // loadMore: fetchNextPage,
    // shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    // count: data?.pages?.[0]?.items?.length ?? 0,
  });
  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto "
    >
      <div className="flex-1" />
      <div className="space-y-2 px-4 mb-4">
        {channel.type === ChannelType.TEXT && (
          <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
            <Hash className="h-12 w-12 text-white" />
          </div>
        )}
        <p className="text-xl md:text-3xl font-bold">
          Welcome to # {channel.name}!
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          This is the start of the #${channel.name} channel.
        </p>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatContent;
