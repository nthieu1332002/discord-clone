import Member from "@/components/members/Member";
import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
  children,
  //params: get from folder name
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true
        }
      }
    }
  });
  if (!server) return redirect("/");
  return (
    <div className="h-full">
      <ServerSidebar id={params.serverId} />
      <main className="h-full md:pl-60 md:pr-60">{children}</main>
      <Member members={server.members} />
    </div>
  );
};

export default ServerIdLayout;
