"use client";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Label } from "../ui/label";
import { useOrigin } from "@/hooks/useOrigin";

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  
  const { server } = data;
  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleClose = () => {
    onClose();
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#2B2D31] text-zinc-500 dark:text-gray-200 p-0 overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-base font-semibold">
            Invite friends to {server?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 px-6 pb-4">
          <Label className="uppercase text-slate-400 text-xs font-bold">
            Send a server invite link to a friend
          </Label>
          <div className="flex gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              className="border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              variant="primary"
              disabled={isLoading}
              onClick={onCopy}
              size="icon"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="px-0 text-xs text-indigo-500 mt-3"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
