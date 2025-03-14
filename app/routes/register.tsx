import type { Route } from "./+types/register";
import {
  Flex,
  Grid,
  Box,
  Avatar,
  TextField,
  Button,
  Text,
} from "@radix-ui/themes";
import { Form, Link, replace, type MetaFunction } from "react-router";
import { GroupIcon, User2, KeyRound } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Register" }];

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
    return new Response(null, {
      status: 415,
      statusText:
        "Unsupported Media Type - Expected 'application/x-www-form-urlencoded'",
    });
  }

  const { full_name, username, password } = Object.fromEntries(
    await request.formData()
  ) as {
    full_name: string;
    username: string;
    password: string;
  };

  if (!full_name || !username || !password) {
    return new Response(null, {
      status: 400,
      statusText: "Missing full name, username or password",
    });
  }

  const findUserByUnique = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (findUserByUnique) {
    return new Response(null, {
      status: 400,
      statusText: "Account already exists",
    });
  }

  const createdUser = await prisma.user.create({
    data: {
      full_name,
      username,
      password,
    },
    select: {
      id: true,
    },
  });

  const gat = generateAccessToken(createdUser.id);
  const grt = generateRefreshToken(createdUser.id);

  return replace("/", {
    headers: [
      ["Set-Cookie", await accessCookie.serialize(gat)],
      ["Set-Cookie", await refreshCookie.serialize(grt)],
    ],
  });
};

export default function Register() {
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
              Sudah memiliki akun?{" "}
              <Link to="/login" style={{ textDecoration: "underline" }}>
                Masuk
              </Link>
            </Text>
          </Grid>

          <Grid gap="1">
            <Text as="label" htmlFor="full_name">
              Nama Lengkap
            </Text>
            <TextField.Root
              size="3"
              id="full_name"
              name="full_name"
              required
              type="text"
              placeholder="John Doe"
              autoComplete="off"
              min={6}
              max={48}
            >
              <TextField.Slot>
                <User2 />
              </TextField.Slot>
            </TextField.Root>
          </Grid>

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
              autoComplete="off"
              min={6}
              max={32}
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
            Register
          </Button>
        </Grid>
      </Form>
    </Flex>
  );
}
