import { ChannelType } from "@prisma/client";
import React from "react";
import { Hash, Volume2Icon } from "lucide-react";

type Props = {
  type: ChannelType;
  name: string;
};

const ChatHeader = ({ type, name }: Props) => {
  return (
    <div className="flex items-center gap-2 text-base font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      {type === ChannelType.TEXT ? (
        <Hash className="h-4 w-4" />
      ) : (
        <Volume2Icon className="h-4 w-4" />
      )}
      <p>{name}</p>
    </div>
  );
};

export default ChatHeader;
