"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberRole, Profile } from "@prisma/client";
import { Crown } from "lucide-react";

type Props = {
  profile: Profile;
  role: MemberRole;
};

const MemberItem = ({ profile, role }: Props) => {
  return (
    <div className="group px-2 py-1 flex items-center gap-2 cursor-pointer rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
      <Avatar className="cursor-pointer w-9 h-9">
        <AvatarImage src={profile.imageUrl} />
        <AvatarFallback>{profile.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center items-center gap-1">
        <p className="text-base font-medium text-black group-hover:text-gray-700/80 dark:text-gray-400 dark:group-hover:text-gray-200">
          {profile.name.length > 15
            ? profile.name.substring(0, 15) + "..."
            : profile.name}
        </p>
      </div>
      {role === MemberRole.ADMIN ? (
        <Crown className="text-yellow-300 w-3 h-3" />
      ) : null}
    </div>
  );
};

export default MemberItem;
