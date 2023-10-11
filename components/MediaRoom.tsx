"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  useConnectionState,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { Profile } from "@prisma/client";
import { PlayJoinSound, PlayLeaveSound } from "./PlayMessageSound";

import useVoiceMemberStore from "@/hooks/useVoiceMemberStore";
import axios from "axios";

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
  const [token, setToken] = useState();
  const { set } = useVoiceMemberStore();
  const deleteOnline = useCallback(async () => {
    try {
      PlayLeaveSound();

      const resp = await axios.delete("/api/onlineusers", {
        data: { id: currentProfile.id },
      });
      set(resp.data);
    } catch (error) {
      console.log(error);
    }
  }, [currentProfile.id, set]);

  useEffect(() => {
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
    return () => {
      deleteOnline();
    };
  }, [channelId, currentProfile.id, deleteOnline, set]);

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
  }, [channelId, currentProfile.name]);

  if (!token) {
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
      onConnected={() => {
        PlayJoinSound();
      }}
      onDisconnected={() => {
        deleteOnline();
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
