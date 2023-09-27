import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  params: {
    serverId: string;
  };
};

const Server = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      categories: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          channels: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true
            }
          }
        }
      },
    },
  });
  const initialChannel = server?.categories.at(0)?.channels.at(0)?.id
  return redirect(`/servers/${params.serverId}/${initialChannel}`)
};

export default Server;
