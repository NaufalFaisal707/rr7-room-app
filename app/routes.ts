import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  layout("routes/chat/layout.tsx", [index("routes/chat/index.tsx")]),
] satisfies RouteConfig;
