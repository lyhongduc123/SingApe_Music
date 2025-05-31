import { X } from "lucide-react-native";
import { Box, Button, Icon, Modal, Text } from "../ui";
import { ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { CloseIcon } from "../ui/icon";
import {
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";

interface ErrorModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ErrorModal = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
}: ErrorModalProps & {}) => {
  return (
    <Modal
      isOpen={visible}
      onClose={() => {
        onClose();
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
            <Icon as={X} className="stroke-error-600" size="xl" />
          </Box>

          <Heading size="md" className="text-typography-950">
            {title}
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-typography-500">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
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
