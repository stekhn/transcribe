import { Modal as MantineModal, Group, Title, Text, Button } from "@mantine/core";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitText?: string;
  submitDisabled?: boolean;
  title: string | JSX.Element;
  content: string | JSX.Element;
}

export const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  onSubmit,
  title,
  content,
  submitText,
  submitDisabled = false,
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={
        typeof title === "string" ? (
          <Title order={3} size='lg' fw={500}>
            {title}
          </Title>
        ) : (
          title
        )
      }
      size='md'
      radius='md'
      shadow='xl'
      centered
    >
      <Text size='sm' c='dimmed' mb='md'>
        {content}
      </Text>

      <Group justify='flex-end' gap='sm'>
        <Button onClick={onClose} variant='light' size='sm' radius='md'>
          Close
        </Button>
        {submitText && (
          <Button disabled={submitDisabled} onClick={onSubmit} variant='filled' size='sm' radius='md'>
            {submitText}
          </Button>
        )}
      </Group>
    </MantineModal>
  );
};
