import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const serverId = searchParams.get("serverId");
    if (!profile) return new NextResponse("Unauthorized", { status: 401 })
    if (!categoryId) return new NextResponse("Category ID missing", { status: 400 });
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
    if (!params.channelId) return new NextResponse("Channel ID missing", { status: 400 });
 
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
          delete: {
            id: params.channelId,
          }
        }
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const categoryId = searchParams.get("categoryId");
    const serverId = searchParams.get("serverId");
    if (!profile) return new NextResponse("Unauthorized", { status: 401 })
    if (!categoryId) return new NextResponse("Category ID missing", { status: 400 });
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
    if (!params.channelId) return new NextResponse("Channel ID missing", { status: 400 });
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
          update: {
            where: {
              id: params.channelId
            },
            data: {
              name,
              type,
            }
          }
        }
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}