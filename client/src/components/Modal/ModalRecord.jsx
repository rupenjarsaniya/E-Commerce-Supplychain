import { Modal, Group, Button } from "@mantine/core";

export const ModalRecord = ({
  variant,
  text,
  content,
  leftIcon,
  loading,
  title,
  opened,
  onClose,
  onOpen,
}) => {
  return (
    <>
      <Modal opened={opened} onClose={onClose} title={title} centered>
        {content}
      </Modal>

      <Group position="center">
        <Button
          variant={variant}
          onClick={onOpen}
          leftIcon={leftIcon}
          loading={loading}
        >
          {text}
        </Button>
      </Group>
    </>
  );
};
