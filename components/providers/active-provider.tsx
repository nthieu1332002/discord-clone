"use client"
import useActiveChannel from "@/hooks/useActiveMember";

const ActiveProvider = () => {
  useActiveChannel();
  return null;
};

export default ActiveProvider;
