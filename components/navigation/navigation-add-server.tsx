"use client";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import CustomTooltip from "../custom-tooltip";

const NavigationAddServer = () => {
  const { onOpen } = useModal();
  return (
    <CustomTooltip side="right" align="center" label="Add a server">
      <button
        onClick={() => {onOpen("createServer"); console.log("click")}}
        className="group flex items-center"
      >
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-green-500">
          <Plus
            className="group-hover:text-white transition text-green-500"
            size={25}
          />
        </div>
      </button>
    </CustomTooltip>
  );
};

export default NavigationAddServer;
