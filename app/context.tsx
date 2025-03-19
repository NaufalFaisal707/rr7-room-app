import { useState, type ReactNode } from "react";
import { createContext, useContext } from "react";
import { type Socket } from "socket.io-client";
import { type User } from "@prisma/client";

type SocketProviderProps = {
  socket: Socket | undefined;
  children: ReactNode;
};

const SocketContext = createContext<Socket | undefined>(undefined);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ socket, children }: SocketProviderProps) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export type SafeUser = Omit<User, "password" | "logout_at">;

type UserContextType = {
  user: SafeUser | undefined;
  setUser: (user: SafeUser | undefined) => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  user,
  setUser,
  children,
}: { children: ReactNode } & UserContextType) {
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
