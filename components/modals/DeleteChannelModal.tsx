import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChannelType } from "@prisma/client";
import { Hash, Volume2Icon } from "lucide-react";
const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { channel, other } = data;
  console.log(data);
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteChannel";
  const handleClose = () => {
    onClose();
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          categoryId: other.id,
          serverId: other.serverId,
        },
      });
      await axios.delete(url);
      setIsLoading(false);
      router.refresh();
      onClose();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#2B2D31] text-zinc-500 dark:text-gray-200 p-0 overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="flex text-base font-semibold">
            Delete channel {channel?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          This will permanently delete the <span className="underline">{channel?.name}</span> and remove all the relevant data.
        </div>
        <DialogFooter className="bg-white dark:bg-zinc-800 flex items-center text-sm gap-2 px-6 py-4">
          <p className="cursor-pointer hover:underline" onClick={handleClose}>
            Cancel
          </p>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            Delete channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
