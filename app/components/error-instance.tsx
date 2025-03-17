import { Text, Button, Flex, AlertDialog } from "@radix-ui/themes";

export default function ErrorInstance({ error }: { error: unknown }) {
  if (error instanceof Error) {
    return (
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title size="6">Error</AlertDialog.Title>
          <AlertDialog.Description
            size="2"
            style={{
              maxWidth: "90vw",
              overflow: "auto",
              backgroundColor: "var(--gray-2)",
              borderRadius: "6px",
              padding: "16px",
              textAlign: "left",
            }}
          >
            <Text size="2" style={{ whiteSpace: "pre" }}>
              {error.stack}
            </Text>
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  }

  return (
    <AlertDialog.Root defaultOpen>
      <AlertDialog.Content>
        <AlertDialog.Title size="6">Unknown Error</AlertDialog.Title>
        <AlertDialog.Description
          size="2"
          style={{
            maxWidth: "90vw",
            overflow: "auto",
            backgroundColor: "var(--gray-2)",
            borderRadius: "6px",
            padding: "16px",
            textAlign: "left",
          }}
        >
          <Text size="2" style={{ whiteSpace: "pre" }}>
            An unknown error occurred
          </Text>
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
