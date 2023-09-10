"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import CustomTooltip from "@/components/custom-tooltip";

type SidebarItemProps = {
  id: string;
  imageUrl: string;
  name: string;
};

const SidebarItem = ({ id, imageUrl, name }: SidebarItemProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <CustomTooltip label={name} side="right" align="center">
      <button onClick={onClick} className="group relative flex items-center active:translate-y-[1px]">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[3.5px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
    </CustomTooltip>
  );
};

export default SidebarItem;
