import { ActionIcon, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Modal } from "./Modal";

interface InfoButtonProps {
  icon: React.ReactNode;
  content?: React.ReactNode;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ icon, content }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon
        variant='subtle'
        radius='xl'
        aria-label='App info'
        onClick={open}
        style={{ alignSelf: "flex-end" }}
      >
        {icon}
      </ActionIcon>
      <Modal
        opened={opened}
        title={"About Transcribe"}
        content={<Text size='sm'>{content}</Text>}
        onClose={close}
        onSubmit={() => {}}
      />
    </>
  );
};
