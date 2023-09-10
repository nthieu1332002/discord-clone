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
