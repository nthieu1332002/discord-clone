import { cn } from "@/lib/utils";
import { ProfileWithChannelId } from "@/types";
import { Profile } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  members: ProfileWithChannelId[];
};

const VoiceList = ({ members }: Props) => {
  console.log("members", members);
  return (
    <div className="flex flex-col gap-1 pl-5">
      {members.map((item) => {
        return (
          <div
            key={item.id}
            className="group pl-2 pr-0 py-1 flex items-center gap-2 cursor-pointer rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
          >
            <Avatar className="cursor-pointer w-5 h-5">
              <AvatarImage src={item.imageUrl} />
              <AvatarFallback>{item.name}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center items-center gap-1">
              <p className="text-xs font-normal text-black group-hover:text-gray-700/80 dark:text-gray-400 dark:group-hover:text-gray-200">
                {item.name.length > 18
                  ? item.name.substring(0, 18) + "..."
                  : item.name}
              </p>
            </div>
            {/* {role === MemberRole.ADMIN ? (
              <Crown className="text-yellow-300 w-3 h-3" />
            ) : null} */}
          </div>
        );
      })}
    </div>
  );
};

export default VoiceList;
