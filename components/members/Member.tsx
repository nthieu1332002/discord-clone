"use client";
import { Member, Profile } from "@prisma/client";
import React from "react";
import MemberItem from "./MemberItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMember from "@/hooks/useMember";

type Props = {
  members: (Member & {
    profile: Profile;
  })[];
};

const Member = ({ members }: Props) => {
  const { members: active } = useMember();

  const online = members.filter((obj) => active.includes(obj.profileId));
  const offline = members.filter((obj) => !active.includes(obj.profileId));

  return (
    <div className="hidden md:flex flex-col dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-60 fixed right-0 inset-y-0">
      <div className="flex items-center w-full text-base font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <p>Members</p>
      </div>
      <ScrollArea>
        <div className="p-2">
          <p className="font-semibold text-xs text-black dark:text-gray-400 uppercase">online — {online.length}</p>
          {online.map((item) => {
            return (
              <MemberItem
                key={item.id}
                role={item.role}
                profile={item.profile}
                status="online"
              />
            );
          })}
        </div>
        <div className="p-2">
        <p className="font-semibold text-xs text-black dark:text-gray-400 uppercase">offline — {offline.length}</p>

          {offline.map((item) => {
            return (
              <MemberItem
                key={item.id}
                role={item.role}
                profile={item.profile}
                status="offline"
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Member;
