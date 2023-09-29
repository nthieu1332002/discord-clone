import React, { useState } from "react";
import { Eye, EyeOff, Trash } from "lucide-react";
import CustomTooltip from "../custom-tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";
import pdf from "@/public/images/pdf-svg.svg";
import docx from "@/public/images/txt-svg.svg";

type Props = {
  item: File;
  removeAttachment: () => void;
};

const PreviewFile = ({ item, removeAttachment }: Props) => {
  const [spoiler, setSpoiler] = useState(false);
  const fileType = item.name.split(".").pop()?.toLowerCase() as string;
  const isPDF = fileType === "pdf";
  const isDOCX = fileType === "docx";
  return (
    <div className="relative flex flex-col justify-between p-2 min-w-[215px] min-h-[215px] w-[215px] h-[215px] dark:bg-[#2b2d31] bg-zinc-300 rounded-sm">
      <div className="absolute -right-5 -top-[2px] z-10">
        <div className="grid grid-flow-col rounded-md overflow-hidden hover:shadow-md">
          <CustomTooltip side="top" align="center" label="Spoiler Attachment">
            <div
              onClick={() => setSpoiler((e) => !e)}
              className="cursor-pointer p-2 flex items-center bg-slate-300 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:translate-y-[1px]"
            >
              {spoiler ? (
                <EyeOff className="ml-auto h-4 w-4 text-red-400" />
              ) : (
                <Eye className="ml-auto h-4 w-4" />
              )}
            </div>
          </CustomTooltip>

          <CustomTooltip side="top" align="center" label="Remove Attachment">
            <div
              onClick={removeAttachment}
              className="cursor-pointer p-2 flex items-center text-red-500 bg-slate-300 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:translate-y-[1px]"
            >
              <Trash className="ml-auto h-4 w-4" />
            </div>
          </CustomTooltip>
        </div>
      </div>
      <div className="relative w-full h-[175px] rounded-md overflow-hidden">
        {isPDF && (
          <Image
            src={pdf}
            alt="preview"
            layout="fill"
            objectFit="contain"
            className={cn(spoiler ? "blur-lg" : "")}
          />
        )}
        {isDOCX && (
          <Image
            src={docx}
            alt="preview"
            layout="fill"
            objectFit="contain"
            className={cn(spoiler ? "blur-lg" : "")}
          />
        )}
        {!isPDF && !isDOCX ? (
          <Image
            src={URL.createObjectURL(item)}
            alt="preview"
            layout="fill"
            objectFit="contain"
            className={cn(spoiler ? "blur-lg" : "")}
          />
        ) : null}
      </div>
      <p className="text-sm truncate text-zinc-800 dark:text-zinc-300 ">
        {item.name}
      </p>
    </div>
  );
};

export default PreviewFile;
