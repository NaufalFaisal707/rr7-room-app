import { Button } from "@radix-ui/themes";
import { Link } from "react-router";
import { useUser } from "~/context";

export default function ChatIndex() {
  const { user } = useUser();

  return (
    <>
      {user && <p>Welcome, {user.full_name}!</p>}
      <h1>hallo index (chat)</h1>
      <Button asChild>
        <Link to="/logout">Logout</Link>
      </Button>
    </>
  );
}
