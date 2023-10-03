"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { Profile } from "@prisma/client";
import { PlayJoinSound, PlayLeaveSound } from "./PlayMessageSound";
import useVoiceMemberStore from "@/hooks/useVoiceMemberStore";

interface MediaRoomProps {
  channelId: string;
  video: boolean;
  audio: boolean;
  currentProfile: Profile;
}

export const MediaRoom = ({
  currentProfile,
  channelId,
  video,
  audio,
}: MediaRoomProps) => {
  const { add, remove } = useVoiceMemberStore();
  const [token, setToken] = useState("");
  const voiceMember = useMemo(() => {
    return { ...currentProfile, channelId: channelId };
  }, [currentProfile, channelId]);

  useEffect(() => {
    PlayJoinSound();
    add(voiceMember);
    return () => {
      PlayLeaveSound();
      remove(voiceMember);
    };
  }, [add, remove, voiceMember]);

  useEffect(() => {
    if (!currentProfile?.name) return;

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
  }, [channelId, currentProfile]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onDisconnected={() => {
        PlayLeaveSound();
        remove(voiceMember);
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
