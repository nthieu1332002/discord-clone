import { MediaRoom } from "@/components/MediaRoom";
import ChatContent from "@/components/chats/ChatContent";
import ChatHeader from "@/components/chats/ChatHeader";
import { ChatInput } from "@/components/chats/ChatInput";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
    include: {
      category: {
        select: {
          serverId: true,
        },
      },
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader name={channel.name} type={channel.type} />
      {channel.type === ChannelType.TEXT ? (
        <div className="flex flex-col h-[calc(100vh-48px)]">
          <ChatContent
            currentProfile={member}
            apiUrl="/api/messages"
            channel={channel}
            paramKey="channelId"
            paramValue={channel.id}
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.category.serverId,
            }}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.category.serverId,
            }}
          />
        </div>
      ) : null}
      <MediaRoom
        currentProfile={profile}
        channelId={channel.id}
        video={false}
        audio={true}
        type={channel.type}
      />
    </div>
  );
};

export default ChannelIdPage;
