import type { Route } from "./+types/login";
import {
  Flex,
  Grid,
  Text,
  TextField,
  Button,
  Box,
  Avatar,
  Callout,
} from "@radix-ui/themes";
import { GroupIcon, InfoIcon, KeyRound, User2 } from "lucide-react";

import {
  Form,
  isRouteErrorResponse,
  Link,
  replace,
  type ErrorResponse,
} from "react-router";
import ErrorInstance from "~/components/error-instance";

export const meta: Route.MetaFunction = () => [{ title: "Login" }];

export const action = async ({ request, context }: Route.ActionArgs) => {
  const {
    prisma,
    accessCookie,
    refreshCookie,
    generateAccessToken,
    generateRefreshToken,
  } = context;

  if (
    !request.headers
      .get("Content-Type")
      ?.includes("application/x-www-form-urlencoded")
  ) {
    throw new Response(null, {
      status: 415,
      statusText:
        "Unsupported Media Type - Expected 'application/x-www-form-urlencoded'",
    });
  }

  const { username, password } = Object.fromEntries(
    await request.formData()
  ) as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing username or password",
    });
  }

  const findUserByUnique = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!findUserByUnique) {
    throw new Response(null, {
      status: 404,
      statusText: "Account does not exist",
    });
  }

  const gat = generateAccessToken(findUserByUnique.id);
  const grt = generateRefreshToken(findUserByUnique.id);

  return replace("/", {
    headers: [
      ["Set-Cookie", await accessCookie.serialize(gat)],
      ["Set-Cookie", await refreshCookie.serialize(grt)],
    ],
  });
};

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  if (isRouteErrorResponse(error)) {
    return <LoginComponent error={error} />;
  }

  return (
    <>
      <ErrorInstance error={error} />
      <LoginComponent />
    </>
  );
};

export default function Login() {
  return <LoginComponent />;
}

function LoginComponent({ error }: { error?: ErrorResponse }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100svh"
      minHeight="fit-content"
    >
      <Form method="POST">
        <Grid gap="4" m="4">
          <Grid gap="2">
            <Box mx="auto">
              <Avatar fallback={<GroupIcon size={32} />} />
            </Box>

            <Text size="6" weight="bold" align="center">
              Selamat datang di Room
            </Text>
            <Text as="p" align="center">
              Belum memiliki akun?{" "}
              <Link to="/register" className="underline">
                Daftar
              </Link>
            </Text>
          </Grid>

          {error && (
            <Callout.Root>
              <Callout.Icon>
                <InfoIcon />
              </Callout.Icon>
              <Callout.Text style={{ maxWidth: "200px" }}>
                {error.statusText}
              </Callout.Text>
            </Callout.Root>
          )}

          <Grid gap="1">
            <Text as="label" htmlFor="username">
              Username
            </Text>
            <TextField.Root
              size="3"
              id="username"
              name="username"
              required
              type="text"
              placeholder="username"
              min={6}
              max={24}
              autoComplete="off"
            >
              <TextField.Slot>
                <User2 />
              </TextField.Slot>
            </TextField.Root>
          </Grid>

          <Grid gap="1">
            <Text as="label" htmlFor="password">
              Password
            </Text>
            <TextField.Root
              size="3"
              id="password"
              name="password"
              required
              type="password"
              placeholder="password"
              min={8}
            >
              <TextField.Slot>
                <KeyRound />
              </TextField.Slot>
            </TextField.Root>
          </Grid>
          <Button type="submit" size="3">
            Masuk
          </Button>
        </Grid>
      </Form>
    </Flex>
  );
}
