import { createCookie } from "react-router";
// import { getAccessExp, getRefreshExp } from "./jwt.js";

const accessCookieName = "__r_a";
const refreshCookieName = "__r_r";

export const accessCookie = createCookie(accessCookieName, {
  maxAge: 60 * 1000,
});

export const refreshCookie = createCookie(refreshCookieName, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
});

export const clearAccessCookie = createCookie(accessCookieName, { maxAge: 0 });

export const clearRefreshCookie = createCookie(refreshCookieName, {
  maxAge: 0,
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
});
