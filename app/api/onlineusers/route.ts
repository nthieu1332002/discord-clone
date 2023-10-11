import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const onlineUsers = await redis.hgetall("onlineusers");
        const onlineUsersArray = Object.entries(onlineUsers).map(([id, channelId]) => ({ id, channelId }));
        return new NextResponse(JSON.stringify(onlineUsersArray), { status: 200 });
    } catch (error) {
        console.log("online users", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export const POST = async (req: Request) => {
    try {
        const { channelId, id } = await req.json();
        if (!channelId) {
            return new NextResponse(JSON.stringify({ error: 'Missing "channelId" query parameter' }), { status: 400 });
        }
         if (!id) {
            return new NextResponse(JSON.stringify({ error: 'Missing "userId" query parameter' }), { status: 400 });
        }
        await redis.hset("onlineusers", id, channelId);
        const onlineUsers = await redis.hgetall("onlineusers");
        const onlineUsersArray = Object.entries(onlineUsers).map(([id, channelId]) => ({ id, channelId }));
        pusherServer.trigger("my-channel", "online-users-added", onlineUsersArray);
        return new NextResponse(JSON.stringify(onlineUsersArray), { status: 200 });
    } catch (error) {
        console.log("online users", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
  ) {
    try {
        const { id } = await req.json();
        if (!id) {
            return new NextResponse(JSON.stringify({ error: 'Missing "userId" or "channelId" query parameter' }), { status: 400 });
        }
        await redis.hdel("onlineusers", id)
        const onlineUsers = await redis.hgetall("onlineusers");
        const onlineUsersArray = Object.entries(onlineUsers).map(([id, channelId]) => ({ id, channelId }));
        pusherServer.trigger("my-channel", "online-users-removed", onlineUsersArray);
        return new NextResponse(JSON.stringify(onlineUsersArray), { status: 200 });
    } catch (error) {
        console.log("online users", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
  }