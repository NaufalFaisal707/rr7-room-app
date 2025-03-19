import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Flex,
  IconButton,
  ScrollArea,
  Separator,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import type { Route } from "./+types/_c";
import { useEffect, useState } from "react";
import {
  data,
  Link,
  Outlet,
  redirect,
  replace,
  useLoaderData,
} from "react-router";
import { io, type Socket } from "socket.io-client";
import { SocketProvider, UserProvider, type SafeUser } from "~/context";
import {
  Bell,
  ChevronsUpDown,
  GroupIcon,
  LucideUserRoundPlus,
  LucideX,
  Plus,
  PlusIcon,
  Search,
  User,
  UserPlus2,
  UserRound,
  UserRoundPlus,
} from "lucide-react";

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
    const { id, iat } = acp as { id: string; iat: number };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        username: true,
        created_at: true,
        logout_at: true,
      },
    });

    const lastLogout = findUserByUnique?.logout_at
      ? new Date(findUserByUnique.logout_at).getTime()
      : 0;

    if (!findUserByUnique || iat * 1000 < lastLogout) {
      throw replace("/login", {
        headers: [
          ["Set-Cookie", await clearAccessCookie.serialize("")],
          ["Set-Cookie", await clearRefreshCookie.serialize("")],
        ],
      });
    }

    const { logout_at, ...nestedFindUserByUnique } = findUserByUnique;

    return data(nestedFindUserByUnique);
  }

  if (rcp) {
    const { id, iat } = rcp as { id: string; iat: number };

    const findUserByUnique = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        username: true,
        created_at: true,
        logout_at: true,
      },
    });

    const lastLogout = findUserByUnique?.logout_at
      ? new Date(findUserByUnique.logout_at).getTime()
      : 0;

    if (!findUserByUnique || iat * 1000 < lastLogout) {
      throw replace("/login", {
        headers: [
          ["Set-Cookie", await clearAccessCookie.serialize("")],
          ["Set-Cookie", await clearRefreshCookie.serialize("")],
        ],
      });
    }

    const { logout_at, ...nestedFindUserByUnique } = findUserByUnique;

    const gat = generateAccessToken(id);

    return data(nestedFindUserByUnique, {
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
  const [socket, setSocket] = useState<Socket>();
  const [friends, setFriends] = useState<SafeUser[]>([]);

  useEffect(() => {
    setUser(loaderData);
  }, []);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.emit("fetchFriendList", user?.id);

    socket.on("friendList", setFriends);

    return () => {
      socket.close();
      socket.off("frendList");
    };
  }, [user]);

  return (
    <SocketProvider socket={socket}>
      <UserProvider user={user} setUser={setUser}>
        <Container height="100svh" minHeight="fit-content">
          <ScrollArea scrollbars="horizontal">
            <Box p="1rem" height="100%">
              <Card
                style={{
                  height: "100%",
                  minHeight: "24rem",
                  minWidth: "fit-content",
                }}
              >
                <Flex height="100%">
                  <Tabs.Root defaultValue="account">
                    <Flex direction="column" minWidth="20rem" height="100%">
                      <Flex gap="4" m="2" align="center">
                        <Box flexGrow="1">
                          <Text size="8" weight="bold">
                            Room
                          </Text>
                        </Box>
                        <IconButton size="3" variant="soft" radius="full">
                          <Plus />
                        </IconButton>
                        <IconButton size="3" variant="soft" radius="full">
                          <UserRound />
                        </IconButton>
                      </Flex>

                      <Box m="2">
                        <TextField.Root placeholder="Cari kontak" radius="full">
                          <TextField.Slot>
                            <Search size="16px" />
                          </TextField.Slot>
                        </TextField.Root>
                      </Box>

                      <Tabs.List>
                        <Tabs.Trigger value="account">Semua pesan</Tabs.Trigger>
                        <Tabs.Trigger value="documents" disabled>
                          Belum di baca
                        </Tabs.Trigger>
                      </Tabs.List>

                      <Box pt="3" flexGrow="1">
                        <Tabs.Content value="account">
                          <ScrollArea scrollbars="vertical">
                            <Flex direction="column" flexGrow="1">
                              {friends.map(({ id, full_name }, key) => {
                                return <Box key={key}>{full_name}</Box>;
                              })}
                            </Flex>
                          </ScrollArea>
                        </Tabs.Content>

                        <Tabs.Content value="documents">
                          <Text size="2">
                            Access and update your documents.
                          </Text>
                        </Tabs.Content>
                      </Box>
                    </Flex>
                  </Tabs.Root>

                  <Box>
                    <Separator orientation="vertical" size="4" mx="2" />
                  </Box>

                  <Flex flexGrow="1" direction="column" minWidth="32rem">
                    <Outlet />
                  </Flex>
                </Flex>
              </Card>
            </Box>
          </ScrollArea>
        </Container>
      </UserProvider>
    </SocketProvider>
  );
}
