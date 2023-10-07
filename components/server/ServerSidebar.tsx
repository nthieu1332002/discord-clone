import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";
import { Member, Profile } from "@prisma/client";
import CategoryList from "../categories/CategoryList";

type Props = {
  id: string,
  members: (Member & {
    profile: Profile;
  })[];
};
const ServerSidebar = async ({ id, members }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: id },
    include: {
      categories: {
        orderBy: { createdAt: "asc" },
        include: {
          channels: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: id,
      profileId: profile.id,
    },
  });
  if (!server || !member) return redirect("/");
  return (
    <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0">
      <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} />
        <CategoryList categories={server.categories} currentProfile={member} members={members}/>
      </div>
    </div>
  );
};

export default ServerSidebar;
