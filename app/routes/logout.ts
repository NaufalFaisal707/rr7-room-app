import type { Route } from "./+types/logout";
import { redirectDocument } from "react-router";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const {
    prisma,
    clearAccessCookie,
    clearRefreshCookie,
    verifyRefreshToken,
    refreshCookie,
  } = context;

  const getAllCookies = request.headers.get("Cookie");

  const rcp = verifyRefreshToken(await refreshCookie.parse(getAllCookies));

  if (rcp) {
    const { id } = rcp as { id: string };

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        logout_at: new Date(),
      },
    });
  }

  return redirectDocument("/", {
    headers: [
      ["Set-Cookie", await clearAccessCookie.serialize("")],
      ["Set-Cookie", await clearRefreshCookie.serialize("")],
    ],
  });
};
