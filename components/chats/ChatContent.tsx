"use client";
import { useChatScroll } from "@/hooks/useChatScroll";
import { Channel, ChannelType, Member } from "@prisma/client";
import { Hash } from "lucide-react";
import React, { ElementRef, Fragment, useRef } from "react";
import Message from "./Message";
import { useMessage } from "@/hooks/useMessage";
import { useMessageQuery } from "@/hooks/useMessageQuery";
import { MessageWithMemberWithProfile } from "@/types";

type ChatContentProps = {
  currentProfile: Member;
  apiUrl: string;
  channel: Channel;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const ChatContent = ({
  currentProfile,
  paramKey,
  paramValue,
  apiUrl,
  channel,
  socketUrl,
  socketQuery,
}: ChatContentProps) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const queryKey = `chat:${channel.id}`;
  const addKey = `chat:${channel.id}:messages`;
  const updateKey = `chat:${channel.id}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessageQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useMessage({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto ">
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
          This is the start of the #{channel.name} channel.
        </p>
      </div>
      <div className="flex flex-col-reverse gap-2">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <Message
                key={message.id}
                currentProfile={currentProfile}
                message={message}
                member={message.member}
                // isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatContent;
