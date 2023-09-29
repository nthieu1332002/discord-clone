import { useModal } from "@/hooks/useModal";
import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
const FileWarning = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "warning";
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-60 bg-red-600 text-center">
        <p className="text-xl font-bold">Too many uploads!</p>
        <p className="text-sm">You can only upload 5 files at a time!</p>
      </DialogContent>
    </Dialog>
  );
};

export default FileWarning;
