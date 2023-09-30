import React from "react";
import { CldImage } from "next-cloudinary";
type Props = {
  url: string;
};
const endpoint = process.env.NEXT_PUBLIC_IMAGE_URL;
const ImageGrid = ({ url }: Props) => {
  const images = url.split(",");
  return (
      <div className="grid grid-flow-row grid-cols-3 gap-1 rounded-md overflow-hidden h-fit max-w-[700px] bg-red-300">
      {images.map((item, index) => {
        return (
          <CldImage
            key={index}
            src={`${endpoint}${item}`}
            className="cursor-pointer object-contain"
            width="400"
            height="300"
            alt="an image of something"
          />
        );
      })}
      {images.map((item, index) => {
        return (
          <CldImage
            key={index}
            src={`${endpoint}${item}`}
            className="cursor-pointer  object-contain"
            width="400"
            height="300"
            alt="an image of something"
          />
        );
      })}
      {images.map((item, index) => {
        return (
          <CldImage
            key={index}
            src={`${endpoint}${item}`}
            className="cursor-pointer object-contain"
            width="400"
            height="300"
            alt="an image of something"
          />
        );
      })}
    </div>
  );
};

export default ImageGrid;
