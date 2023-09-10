import { Server } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  PlusCircle,
  PlusSquare,
  Settings,
  Trash,
  UserPlus2,
} from "lucide-react";

import React from "react";
type ServerHeaderProps = {
  server: Server;
};

const ServerHeader = ({ server }: ServerHeaderProps) => {
    const serverName = server.name.substring(0, 20) + "..."
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-primary font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {serverName}
          <ChevronDown className="ml-auto h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-1 py-2 w-56 text-xs font-normal text-black dark:text-neutral-400 space-y-[2px]">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-indigo-400 text-sm cursor-pointer hover:text-white hover:bg-indigo-500">
            Invite People
            <DropdownMenuShortcut>
              <UserPlus2 className="h-4 w-4 ml-auto"/>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500">
            Server Settings
            <DropdownMenuShortcut>
              <Settings className="h-4 w-4 ml-auto"/>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500">
            Create Channel
            <DropdownMenuShortcut>
              <PlusCircle className="h-4 w-4 ml-auto"/>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500">
            Create Category
            <DropdownMenuShortcut><PlusSquare className="h-4 w-4 ml-auto"/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 text-sm cursor-pointer hover:text-white hover:bg-red-500">
          Delete Server
          <DropdownMenuShortcut>
            <Trash className="h-4 w-4 ml-auto"/>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
