import React from "react";
import { CldImage } from "next-cloudinary";
import CustomTooltip from "../custom-tooltip";
import { Trash } from "lucide-react";

type Props = {
  url: string;
};

const endpoint = process.env.NEXT_PUBLIC_IMAGE_URL;

const ImageGrid = ({ url }: Props) => {
  const images = url.split(",");

  const numRows = Math.ceil(images.length / 3);
  const gridTemplateRows = `repeat(${numRows}, 1fr)`;
  const removeImage = (e: any, item: string) => {
    e.preventDefault();
    images.filter(i => i !== item)
  };
  return (
    <div
      className="grid grid-cols-3 gap-1 rounded-md overflow-hidden max-w-[600px]"
      style={{ gridTemplateRows }}
    >
      {images.map((item, index) => {
        return (
          <a
            href={`${endpoint}${item}`}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="relative group/item"
          >
            <CldImage
              src={`${endpoint}${item}`}
              className="cursor-pointer object-cover rounded-sm bg-red-300 h-full w-full"
              alt="an image of something"
              height="300"
              width="300"
            />
            <div className="absolute right-2 top-2 z-10 invisible group-hover/item:visible">
              <CustomTooltip side="top" align="center" label="Delete">
                <div
                  onClick={(e) => removeImage(e, item)}
                  className="cursor-pointer rounded-md p-2 flex items-center text-gray-400 dark:hover:text-gray-100 bg-slate-300 hover:bg-red-400 dark:bg-zinc-800 dark:hover:bg-red-600 active:translate-y-[1px]"
                >
                  <Trash className="ml-auto h-4 w-4" />
                </div>
              </CustomTooltip>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default ImageGrid;
