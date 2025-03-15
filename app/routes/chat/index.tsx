import { useUser } from "~/context";

export default function ChatIndex() {
  const { user } = useUser();

  return (
    <>
      {user && <p>Welcome, {user.full_name}!</p>}
      <h1>hallo index (chat)</h1>
    </>
  );
}
