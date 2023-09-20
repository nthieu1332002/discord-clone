import { NextApiRequest, NextApiResponse } from "next"


import { pusherServer } from "@/lib/pusher";
import { currentProfileForPageRoute } from "@/lib/current-profile-for-page-route";

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
    const profile = await currentProfileForPageRoute(req);
    if (!profile) return res.status(401).json({ error: "Unauthorized" });

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const data = {
    user_id: profile.id,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return res.send(authResponse);
};