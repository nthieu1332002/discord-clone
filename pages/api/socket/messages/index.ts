
import { currentProfileForPageRoute } from "@/lib/current-profile-for-page-route";
import { db } from "@/lib/db";
import { SocketIOResponse } from "@/types";
import { NextApiRequest } from "next";
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    secure: true,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "8mb" // Set desired value here
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: SocketIOResponse,
) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const profile = await currentProfileForPageRoute(req);
        const { serverId, channelId } = req.query;
        const { content, file } = req.body;
        if (!profile) return res.status(401).json({ error: "Unauthorized" });
        if (!serverId) return res.status(400).json({ error: "Server ID missing" });
        if (!channelId) return res.status(400).json({ error: "Channel ID missing" });
        const result = await Promise.all(
            file.map((f: string) =>
                new Promise<string>((resolve, reject) => {
                    cloudinary.uploader.upload(
                        f,
                        {
                            folder: "discord-clone",
                            width: 500,
                            crop: "limit",
                            quality: 50
                        },
                        (err, result) => {
                            if (result && result.version && result.public_id) return resolve(`${result.version}/${result.public_id}`);
                            return reject(err);
                        }
                    );
                })
            )
        );
        const fileUrl = result.join(',')
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true,
            }
        });
        if (!server) return res.status(404).json({ message: "Server not found" });

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                category: {
                    serverId: serverId as string
                }
            }
        });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        const member = await server.members.find((member) => member.profileId === profile.id)
        if (!member) return res.status(404).json({ message: "Member not found" });

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        });
        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}