import type { Route } from "./+types/login";
import {
  Flex,
  Grid,
  Text,
  TextField,
  Button,
  Box,
  Avatar,
} from "@radix-ui/themes";
import { GroupIcon, KeyRound, User2 } from "lucide-react";

import { Form, Link } from "react-router";

export const meta: Route.MetaFunction = () => [{ title: "Login" }];

export const action = async ({ request, context }: Route.ActionArgs) => {
  const { prisma } = context;

  const formData = Object.fromEntries(await request.formData());

  if (!formData.username || !formData.password) {
    return null;
  }

  const findUserByUnique = await prisma.user.findMany();

  console.log(formData, findUserByUnique);

  return null;
};

export default function Login() {
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
