import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "http";
import { Server as ServerIO } from "socket.io";
import { SocketIOResponse } from "@/types";

export const config = {
    api: {
      bodyParser: false,
    },
  };

const SocketHandler = (req: NextApiRequest, res: SocketIOResponse) => {
    //check if socket is running or not
    if (!res.socket.server.io) {
        //initializing socket
        const path = "/api/socket/io";
        const httpServer: Server = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            // @ts-ignore
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }

    res.end();
}

export default SocketHandler;