"use client";
import { Member, MemberRole, Profile } from "@prisma/client";
import React, { useMemo } from "react";
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

  const admin = useMemo(
    () =>
      members.filter(
        (obj) => active.includes(obj.profileId) && obj.role === MemberRole.ADMIN
      ),
    [members, active]
  );

  const mod = useMemo(
    () =>
      members.filter(
        (obj) =>
          active.includes(obj.profileId) && obj.role === MemberRole.MODERATOR
      ),
    [members, active]
  );

  const online = useMemo(
    () =>
      members.filter(
        (obj) =>
          obj.role === MemberRole.GUEST && active.includes(obj.profileId)
      ),
    [members, active]
  );

  const offline = useMemo(
    () => members.filter((obj) => !active.includes(obj.profileId)),
    [members, active]
  );
  return (
    <div className="hidden md:flex flex-col dark:bg-[#2B2D31] bg-[#F2F3F5] h-full w-60 fixed right-0 inset-y-0">
      <div className="flex items-center w-full text-base font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <p>Members</p>
      </div>
      <ScrollArea className="p-2">
        {[admin, mod, online, offline].map((group, index) => (
          <React.Fragment key={index}>
            {group.length > 0 ? (
              <p className="pt-4 pl-1 font-semibold text-xs text-black dark:text-gray-400 uppercase">
                {index === 0
                  ? "admin"
                  : index === 1
                  ? "mod"
                  : index === 2
                  ? "online"
                  : "offline"}{" "}
                — {group.length}
              </p>
            ): null}
            {group.map((item) => (
              <MemberItem
                key={item.id}
                role={item.role}
                profile={item.profile}
                status={active.includes(item.profileId) ? "online" : "offline"}
              />
            ))}
          </React.Fragment>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Member;
