import Image from "next/image";
import { ImageResponse } from "next/server";
import favicon from "./favicon.ico";
// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <Image
        src={favicon}
        alt="favicon"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      >
        A
      </Image>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
