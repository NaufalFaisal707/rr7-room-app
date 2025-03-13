import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

declare module "react-router" {
  interface AppLoadContext {
    prisma: PrismaClient;
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
      };
    },
  })
);
