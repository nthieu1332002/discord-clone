import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { ModeToggle } from "@/components/toggle";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarItem from "@/components/sidebar/SidebarItem";
import SidebarButton from "./SidebarButton";

const Sidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    }
  });
  const sortedServers =[...servers.sort((a, b) => {
    if (a.profileId === profile.id) return -1;
    if (b.profileId === profile.id) return 1;
    return 0
  })];
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1d1d22] bg-[#E3E5E8] py-3">

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {sortedServers.map((server) => (
          <div key={server.id} className="mb-4">
            <SidebarItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
        <SidebarButton/>
      </ScrollArea>
      <div className="pb-3 mt-auto flex flex-col items-center gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
