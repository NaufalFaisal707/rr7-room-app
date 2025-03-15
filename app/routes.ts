import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("logout", "routes/logout.ts"),

  layout("routes/chat/layout.tsx", [
    index("routes/chat/index.tsx"),
    route(":frendId", "routes/chat/$frendId.tsx"),
  ]),
] satisfies RouteConfig;
