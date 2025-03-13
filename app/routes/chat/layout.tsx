import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { io, type Socket } from "socket.io-client";
import { SocketProvider } from "~/context";

export default function ChatLayout() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketProvider socket={socket}>
      <Outlet />
    </SocketProvider>
  );
}
