import { Button, Icon, Modal, Text } from "../ui";
import { ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { CloseIcon } from "../ui/icon";
import { ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";

interface NormalModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export const NormalModal = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
}: NormalModalProps & {}) => {
  return (
    <Modal
      isOpen={visible}
      onClose={() => {
        onClose();
      }}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" className="text-typography-950">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text size="lg" className="text-typography-500">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => { 
              onCancel();
            }}
          >
            <ButtonText>{cancelText}</ButtonText>
          </Button>
          <Button
            onPress={() => {
              onConfirm();
            }}
          >
            <ButtonText>{confirmText}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
