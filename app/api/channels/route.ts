import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        if (!profile) return new NextResponse("Unauthorized", { status: 401 })
        if (!categoryId) return new NextResponse("Category ID missing", { status: 400 });

        const channel = await db.category.update({
            where: {
                id: categoryId,
                server: {
                    members: {
                        some: {
                            profileId: profile.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                }
                
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        });
        return NextResponse.json(channel);
    } catch (error) {
        console.log("Channels post", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}