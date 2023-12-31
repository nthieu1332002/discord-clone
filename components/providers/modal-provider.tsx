"use client";
import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";
import { InviteModal } from "@/components/modals/InviteModal";
import { DeleteMessageModal } from "@/components/modals/DeleteMessageModal";
import { useModal } from "@/hooks/useModal";
import { EditChannelModal } from "@/components/modals/EditChannelModal";
import DeleteChannelModal from "../modals/DeleteChannelModal";
import FileWarning from "../modals/FileWarningModal";
import DeleteAttachmentModal from "../modals/DeleteAttachmentModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type } = useModal();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      {isOpen && type === "createServer" && <CreateServerModal />}
      {isOpen && type === "createChannel" && <CreateChannelModal />}
      {isOpen && type === "editChannel" && <EditChannelModal />}
      {isOpen && type === "createCategory" && <CreateCategoryModal />}
      {isOpen && type === "invite" && <InviteModal />}
      {isOpen && type === "deleteMessage" && <DeleteMessageModal />}
      {isOpen && type === "deleteChannel" && <DeleteChannelModal />}
      {isOpen && type === "warning" && <FileWarning />}
      {isOpen && type === "deleteAttachment" && <DeleteAttachmentModal />}      

    </>
  );
};

export default ModalProvider;
