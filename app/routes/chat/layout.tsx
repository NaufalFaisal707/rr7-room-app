import { Box, Button, Container, Flex, ScrollArea } from "@radix-ui/themes";
import type { Route } from "./+types/layout";
import { useEffect, useState } from "react";
import { Link, Outlet, redirect, replace } from "react-router";
import { io, type Socket } from "socket.io-client";
import { SocketProvider, UserProvider, type SafeUser } from "~/context";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const {
    prisma,
    verifyAccessToken,
    verifyRefreshToken,
    accessCookie,
    refreshCookie,
    clearAccessCookie,
    clearRefreshCookie,
    generateAccessToken,
  } = context;

  const getAllCookies = request.headers.get("Cookie");

  const acp = verifyAccessToken(await accessCookie.parse(getAllCookies));
  const rcp = verifyRefreshToken(await refreshCookie.parse(getAllCookies));

  if (acp) {
    const { id, iat, exp } = acp as { id: string; iat: number; exp: number };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        created_at: true,
        logout_at: true,
      },
    });

    const lastLogout = findUserByUnique?.logout_at
      ? new Date(findUserByUnique.logout_at).getTime()
      : 0;
    const tokenIssuedAt = iat * 1000;

    if (!findUserByUnique || tokenIssuedAt < lastLogout) {
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
    const { id, iat, exp } = rcp as { id: string; iat: number; exp: number };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        created_at: true,
        logout_at: true,
      },
    });

    const lastLogout = findUserByUnique?.logout_at
      ? new Date(findUserByUnique.logout_at).getTime()
      : 0;
    const tokenIssuedAt = iat * 1000;

    if (!findUserByUnique || tokenIssuedAt < lastLogout) {
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
        <>
          <Button asChild>
            <Link to="/logout">Logout</Link>
          </Button>
          <Outlet />
        </>
      </UserProvider>
    </SocketProvider>
  );
}
