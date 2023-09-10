import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelType } from "@prisma/client";
import CategoryItem from "../categories/CategoryItem";

const ServerSidebar = async ({ id }: { id: string }) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: id },
    include: {
      categories: {
        
        orderBy: { createdAt: "asc" },
        include: {
          channels: {
            orderBy: { createdAt: "asc"}
          }
        }
      },
    },
  });
  console.log(server);
  if (!server) return redirect("/");
  // const textChannels = server.channels.filter(e => e.type === ChannelType.TEXT)
  // const audioChannels = server.channels.filter(e => e.type === ChannelType.AUDIO)
  // const videoChannels = server.channels.filter(e => e.type === ChannelType.VIDEO)

  return (
    <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0">
      <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} />
        <ScrollArea className="p-3">
          {server.categories.map((item) => {
            return <CategoryItem key={item.id} name={item.name} channels={item.channels} />;
          })}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ServerSidebar;
