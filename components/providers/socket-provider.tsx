"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  console.log("connect?", isConnected);
  useEffect(() => {
    const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    const connectHandler = () => {
      setIsConnected(true);
    };

    const disconnectHandler = () => {
      setIsConnected(false);
    };

    socketInstance.on("connect", connectHandler);
    socketInstance.on("disconnect", disconnectHandler);

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect", connectHandler);
      socketInstance.off("disconnect", disconnectHandler);
      socketInstance.disconnect();
    };
  }, []);

  //   useEffect(() => {
  //     const socketInstance = new (io as any)(
  //       process.env.NEXT_PUBLIC_SITE_URL!,
  //       {
  //         path: "/api/socket/io",
  //         addTrailingSlash: false,
  //       }
  //     );

  //     socketInstance.on("connect", () => {
  //       setIsConnected(true);
  //     });

  //     socketInstance.on("disconnect", () => {
  //       setIsConnected(false);
  //     });

  //     setSocket(socketInstance);

  //     return () => {
  //       socketInstance.disconnect();
  //     };
  //   }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
