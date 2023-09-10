import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })

        const server = await db.server.create({
            data: {
                name,
                imageUrl,
                inviteCode: uuidv4(),
                profileId: profile.id,
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                },
                categories: {
                    create: [
                        {
                            name: "text channels",
                            channels: {
                                create: [
                                    { name: "general", profileId: profile.id}
                                ]
                            }
                        }
                    ]
                },

            },
            include: {
                categories: {
                    include: {
                        channels: true,
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("Servers_post", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}