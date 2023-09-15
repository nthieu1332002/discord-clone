import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Member, Profile } from "@prisma/client";

type Props = {
  member: Member & {
    profile: Profile;
  };
  content: string;
};

const Message = ({ member, content }: Props) => {
  return (
    <div className="group px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-800/50 flex gap-3">
      <Avatar className="cursor-pointer">
        <AvatarImage src={member.profile.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center text-zinc-600 dark:text-zinc-200">
          <p className="text-sm font-semibold cursor-pointer hover:underline">
            {member.profile.name}
          </p>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 cursor-default">
            Today at 9:28 AM
          </span>
        </div>
        <p className="text-sm font-light">{content}</p>
      </div>
    </div>
  );
};

export default Message;
