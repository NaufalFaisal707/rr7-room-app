import compression from "compression";
import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./server/lib/jwt.js";
import { accessCookie } from "./server/lib/cookie.js";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// initial prisma client for socket.io connection
const prisma = new PrismaClient();

// socket.io middleware
io.use(async (socket, next) => {
  const { cookie } = socket.handshake.headers;

  if (!cookie) {
    return next(new Error("No cookie provided"));
  }

  const acp = verifyAccessToken(await accessCookie.parse(cookie));

  if (!acp) {
    return next(new Error("Invalid access token"));
  }

  next();
});

// socket.io connection
io.on("connection", async (socket) => {
  const { id } = socket;

  console.log("A user connected:", id);

  socket.on("fetchFriendList", async (userId) => {
    const findUserFriendList = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    socket.emit("friendList", findUserFriendList?.friends || []);
  });
});

app.use(compression());
app.disable("x-powered-by");

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

app.use(morgan("tiny"));

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
