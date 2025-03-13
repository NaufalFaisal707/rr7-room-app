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

type SafeUser = Omit<User, "password">;

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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | undefined>(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
