import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { pusherServer } from "@/lib/pusher";
type Props = {
  params: {
    inviteCode: string;
  };
};

const InvitePage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  if (!params.inviteCode) return redirect("/");

  //check if that user already in server
  const validServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (validServer) return redirect(`/servers/${validServer.id}`);

  //create member in server
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    pusherServer
      .trigger("presence-member", "pusher:member_added", profile.id)
    return redirect(`/servers/${server.id}`);
  }
  return null;
};

export default InvitePage;
