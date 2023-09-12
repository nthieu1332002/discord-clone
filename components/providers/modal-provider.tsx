"use client";
import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { CreateCategoryModal } from "@/components/modals/CreateCategoryModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <CreateCategoryModal />
    </>
  );
};

export default ModalProvider;
