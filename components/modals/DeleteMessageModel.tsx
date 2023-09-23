"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DATE_FORMAT = "MM/dd/yyyy hh:mm aa";
export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query, other } = data;
  const message = other;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#2B2D31] text-zinc-500 dark:text-gray-200 p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-xl font-semibold">
            Delete Message
          </DialogTitle>
          <DialogDescription className=" text-slate-300">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        <div className="relative group px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-800/50 flex gap-3">
          <Avatar className="cursor-pointer">
            <AvatarImage src={message?.member?.profile.imageUrl} />
            <AvatarFallback>{message?.member?.profile.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center text-zinc-600 dark:text-zinc-200">
              <p className="text-sm font-semibold cursor-pointer hover:underline">
                {message?.member?.profile.name}
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 cursor-default">
                {message && format(new Date(message?.createdAt), DATE_FORMAT)}
              </span>
            </div>
            <p className="text-sm font-light">{message?.content}</p>
          </div>
        </div>
        <DialogFooter className="bg-white dark:bg-zinc-800 flex items-center text-sm gap-2 px-6 py-4">
          <p className="cursor-pointer hover:underline" onClick={onClose}>
            Cancel
          </p>
          <Button variant="destructive" disabled={isLoading} onClick={onClick}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
