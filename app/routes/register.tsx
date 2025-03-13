import {
  Flex,
  Grid,
  Box,
  Avatar,
  TextField,
  Button,
  Text,
} from "@radix-ui/themes";
import { Form, Link, type MetaFunction } from "react-router";
import { GroupIcon, User2, KeyRound } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Register" }];

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
              min={6}
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
            Register
          </Button>
        </Grid>
      </Form>
    </Flex>
  );
}
