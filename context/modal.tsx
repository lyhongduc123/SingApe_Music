// components/AlertModalProvider.tsx
import { ErrorModal } from "@/components/modals/ErrorModal";
import { NormalModal } from "@/components/modals/NormalModal";
import { Button, Icon, Modal, Text } from "@/components/ui";
import { ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon } from "@/components/ui/icon";
import {
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
show: {
  (options: {
    title: string;
    message: string;
    type: "error" | "normal";
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }): void;
};
  hide: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal must be used within AlertModalProvider");
  return context;
};

export const ModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmText, setConfirmText] = useState("OK");
  const [cancelText, setCancelText] = useState("Cancel");
  const [type, setType] = useState<"error" | "normal">("normal");
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();

  const show = (options: {
    title: string;
    message: string;
    type: "error" | "normal";
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => {
    const {
      title,
      message,
      type = "normal",
      confirmText = "OK",
      cancelText = "Cancel",
      onConfirm,
    } = options;
    setTitle(title);
    setMessage(message);
    setConfirmText(confirmText);
    setCancelText(cancelText);
    setType(type);
    setOnConfirm(() => onConfirm);
    setVisible(true);
  };

  const hide = () => setVisible(false);

  const handleConfirm = () => {
    hide();
    onConfirm?.();
  };

  const renderModal = () => {
    switch (type) {
      case "error":
        return (
          <ErrorModal
            visible={visible}
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={handleConfirm}
            onClose={hide}
          />
        );
      case "normal":
        return (
          <NormalModal
            visible={visible}
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={handleConfirm}
            onCancel={hide}
            onClose={hide}
          />
        );
      default:
        return null;
    }
  }

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
};
