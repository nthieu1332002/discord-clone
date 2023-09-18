import { Member, Profile } from "@prisma/client";
import React from "react";
import MemberItem from "./MemberItem";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  members: (Member & {
    profile: Profile
  })[]
};

const Member = ({ members }: Props) => {
  return (
    <div className="hidden md:flex flex-col dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-60 fixed right-0 inset-y-0">
      <div className="flex items-center w-full text-base font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <p>Members</p>
      </div>
      <ScrollArea>
        <div className="p-2">
          {members.map((item) => {
            return <MemberItem key={item.id} role={item.role} profile={item.profile}/>;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Member;
