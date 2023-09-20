import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Pencil, Trash } from "lucide-react";

type Props = {
  member: Member & {
    profile: Profile;
  };
  message: Message;
};
const DATE_FORMAT = "MM/dd/yyyy hh:mm aa";
const Message = ({ message, member }: Props) => {
  const onCopy = () => {
    navigator.clipboard.writeText(message.content);
  };
  return (
    <div className="relative group px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-800/50 flex gap-3">
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
            {format(new Date(message.createdAt), DATE_FORMAT)}
          </span>
        </div>
        <p className="text-sm font-light">{message.content}</p>
      </div>
      <div className="absolute invisible group-hover:visible right-2 -top-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none" asChild>
            <button className="rounded-md text-primary font-semibold p-2 flex items-center dark:bg-zinc-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/60">
              <MoreHorizontal className="ml-auto h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className="px-1 py-2 w-56 text-xs font-normal text-black dark:text-neutral-400 space-y-[2px]"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                // onClick={() => onOpen("invite", { server })}
                className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500 dark:hover:bg-indigo-500"
              >
                Edit Message
                <DropdownMenuShortcut>
                  <Pencil className="h-4 w-4 ml-auto" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onCopy}
                className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500 dark:hover:bg-indigo-500"
              >
                Copy text
                <DropdownMenuShortcut>
                  <Copy className="h-4 w-4 ml-auto" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {member.role === MemberRole.ADMIN ||
              member.role === MemberRole.MODERATOR ? (
                <DropdownMenuItem className="text-red-500 text-sm cursor-pointer hover:text-white hover:bg-red-500 dark:hover:bg-red-500">
                  Delete message
                  <DropdownMenuShortcut>
                    <Trash className="h-4 w-4 ml-auto" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Message;
