import { currentProfileForPageRoute } from "@/lib/current-profile-for-page-route";
import { db } from "@/lib/db";
import { SocketIOResponse } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: SocketIOResponse,
) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const { fileUrl} = req.body;
        const { messageId, serverId, channelId } = req.query;
        const profile = await currentProfileForPageRoute(req);

        if (!profile) return res.status(401).json({ error: "Unauthorized" });
        if (!serverId) return res.status(400).json({ error: "Server ID missing" });
        if (!channelId) return res.status(400).json({ error: "Channel ID missing" });

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true,
            }
        })
        if (!server) return res.status(404).json({ error: "Server not found" });

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!message || message.deleted) return res.status(404).json({ error: "Message not found" });
        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member) return res.status(404).json({ error: "Member not found" });

        const isMessageOwner = message.memberId === member.id;
        if (!isMessageOwner) return res.status(401).json({ error: "Unauthorized" });
        message = await db.message.update({
            where: {
                id: messageId as string,
            },
            data: {
                fileUrl: fileUrl === "" ? null : fileUrl,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, message);
        return res.status(200).json(message);
    } catch (error) {
        console.log("[ATTACHMENT] Error", error);
        return res.status(500).json({ error: "Internal Error" });
    }
}  