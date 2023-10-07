"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { ChannelType, Profile } from "@prisma/client";
import { PlayJoinSound, PlayLeaveSound } from "./PlayMessageSound";
import { pusherClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";
import useVoiceMemberStore, { VoiceMember } from "@/hooks/useVoiceMemberStore";
import axios from "axios";
import { cn } from "@/lib/utils";
import useChannelStore from "@/hooks/useChannelStore";

interface MediaRoomProps {
  channelId: string;
  video: boolean;
  audio: boolean;
  currentProfile: Profile;
  type: ChannelType;
}

export const MediaRoom = ({
  currentProfile,
  channelId,
  video,
  audio,
  type,
}: MediaRoomProps) => {
  const { channelType, setType } = useChannelStore();
  const [token, setToken] = useState();
  const { set } = useVoiceMemberStore();

  useEffect(() => {
    if (!channelType) {
      setType(type);
    }
  }, [type, setType, channelType]);

  useEffect(() => {
    if (channelType === ChannelType.TEXT && type === ChannelType.TEXT) return;
    const fetchOnline = async () => {
      try {
        const resp = await axios.post("/api/onlineusers", {
          channelId: channelId,
          id: currentProfile.id,
        });
        set(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOnline();
  }, [channelId, channelType, currentProfile.id, set, type]);

  useEffect(() => {
    if (!currentProfile?.name && type === ChannelType.TEXT) return;

    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${channelId}&username=${currentProfile.name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [channelId, currentProfile.name, type]);

  const renderLoader = () => (
    <div className="flex flex-col flex-1 justify-center items-center">
      <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
    </div>
  );
  return (
    <>
      {token ? (
        <LiveKitRoom
          data-lk-theme="default"
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          token={token}
          connect={true}
          video={video}
          audio={audio}
          onDisconnected={() => {
            // PlayLeaveSound();
          }}
          className={cn(type === ChannelType.TEXT ? "hidden" : "")}
        >
          <VideoConference />
        </LiveKitRoom>
      ) : null}
    </>
  );
};
