import type { Route } from "./+types/layout";
import { useEffect, useState } from "react";
import { Outlet, redirect, replace, useLoaderData } from "react-router";
import { io, type Socket } from "socket.io-client";
import {
  SocketProvider,
  UserProvider,
  useUser,
  type SafeUser,
} from "~/context";
import {
  accessCookie,
  clearAccessCookie,
  clearRefreshCookie,
  refreshCookie,
} from "~/lib/cookie";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "~/lib/jwt";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const { prisma } = context;

  const getAllCookies = request.headers.get("Cookie");

  const acp = verifyAccessToken(await accessCookie.parse(getAllCookies));
  const rcp = verifyRefreshToken(await refreshCookie.parse(getAllCookies));

  if (acp) {
    const { id } = acp as { id: string };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        logout: true,
        created_at: true,
        logout_at: true,
      },
    });

    if (!findUserByUnique || findUserByUnique.logout) {
      throw replace("/login", {
        headers: [
          ["Set-Cookie", await clearAccessCookie.serialize("")],
          ["Set-Cookie", await clearRefreshCookie.serialize("")],
        ],
      });
    }

    return Response.json(findUserByUnique);
  }

  if (rcp) {
    const { id } = rcp as { id: string };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        logout: true,
        created_at: true,
        logout_at: true,
      },
    });

    if (!findUserByUnique || findUserByUnique.logout) {
      throw replace("/login", {
        headers: [
          ["Set-Cookie", await clearAccessCookie.serialize("")],
          ["Set-Cookie", await clearRefreshCookie.serialize("")],
        ],
      });
    }

    const gat = generateAccessToken(id);

    return Response.json(findUserByUnique, {
      headers: {
        "Set-Cookie": await accessCookie.serialize(gat),
      },
    });
  }

  return redirect("/login", {
    headers: [
      ["Set-Cookie", await clearAccessCookie.serialize("")],
      ["Set-Cookie", await clearRefreshCookie.serialize("")],
    ],
  });
};

export default function ChatLayout({ loaderData }: Route.ComponentProps) {
  const [user, setUser] = useState<SafeUser>();

  useEffect(() => {
    setUser(loaderData);
  }, []);

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
      <UserProvider user={user} setUser={setUser}>
        <Outlet />
      </UserProvider>
    </SocketProvider>
  );
}
