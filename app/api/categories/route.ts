import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const profile = await currentProfile();
        const { name } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!serverId) return new NextResponse("Server ID missing", { status: 400 });

        const category = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                categories: {
                    create: {
                        name: name,
                    }
                }
            }
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log("Categories post", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}