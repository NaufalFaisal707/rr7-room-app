import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  accessCookie,
  refreshCookie,
  clearAccessCookie,
  clearRefreshCookie,
} from "./lib/cookie";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./lib/jwt";
import type { JwtPayload } from "jsonwebtoken";
import type { Cookie } from "react-router";
const { hash } = bcrypt;

declare module "react-router" {
  interface AppLoadContext {
    prisma: PrismaClient;
    accessCookie: Cookie;
    refreshCookie: Cookie;
    clearAccessCookie: Cookie;
    clearRefreshCookie: Cookie;
    generateAccessToken: (value: string) => string;
    generateRefreshToken: (value: string) => string;
    verifyAccessToken: (token: string) => string | JwtPayload | null;
    verifyRefreshToken: (token: string) => string | JwtPayload | null;
  }
}

// initial prisma client for React Router connection
const prisma = new PrismaClient().$extends({
  query: {
    async $allOperations({ operation, args, model, query }) {
      if (operation === "create" || operation === "update") {
        if (model === "User" && args.data?.password) {
          args.data.password = await hash(args.data.password, 10);
          return query(args);
        }
      }

      return await query(args);
    },
  },
});

export const app = express();

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        prisma: prisma as PrismaClient,
        accessCookie,
        refreshCookie,
        clearAccessCookie,
        clearRefreshCookie,
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken,
      };
    },
  })
);
