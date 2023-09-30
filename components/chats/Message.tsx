import React, { useEffect, useState } from "react";
import qs from "query-string";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/hooks/useModal";
import ImageGrid from "./ImageGrid";

type Props = {
  currentProfile: Member;
  member: Member & {
    profile: Profile;
  };
  message: Message;
  socketUrl: string;
  socketQuery: Record<string, string>;
};
const DATE_FORMAT = "MM/dd/yyyy hh:mm aa";

const formSchema = z.object({
  content: z.string().min(1).max(1000),
});

const Message = ({
  currentProfile,
  message,
  member,
  socketUrl,
  socketQuery,
}: Props) => {
  const { onOpen } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: message.content,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${message.id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   form.reset({
  //     content: content,
  //   })
  // }, [content]);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);
  return (
    <div className="relative group px-4 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-800/50 flex gap-3">
      <Avatar className="cursor-pointer">
        <AvatarImage src={member.profile.imageUrl} />
        <AvatarFallback>{member.profile.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center text-zinc-600 dark:text-zinc-200">
          <p className="text-sm font-semibold cursor-pointer hover:underline">
            {member.profile.name}
          </p>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 cursor-default">
            {format(new Date(message.createdAt), DATE_FORMAT)}
          </span>
        </div>
        {isEditing ? (
          <Form {...form}>
            <form
              className="flex items-center w-full gap-x-2 pt-2 pr-12"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited message"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} size="sm" variant="primary">
                Save
              </Button>
            </form>
            <span className="text-[10px] mt-1 text-zinc-400">
              Press escape to cancel, enter to save
            </span>
          </Form>
        ) : (
          <p className="text-sm font-light">{message.content}</p>
        )}
        {message.fileUrl ? <ImageGrid url={message.fileUrl}/>: null}
      </div>
      <div className="absolute invisible group-hover:visible right-2 -top-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none" asChild>
            <button className="rounded-md p-2 flex items-center dark:bg-zinc-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/60">
              <MoreHorizontal className="ml-auto h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className="px-1 py-2 w-56 text-xs font-normal text-black dark:text-neutral-400 space-y-[2px]"
          >
            <DropdownMenuGroup>
              {currentProfile.id === member.id && (
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500 dark:hover:bg-indigo-500"
                >
                  Edit Message
                  <DropdownMenuShortcut>
                    <Pencil className="h-4 w-4 ml-auto" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onCopy}
                className="text-sm cursor-pointer hover:text-white hover:bg-indigo-500 dark:hover:bg-indigo-500"
              >
                Copy text
                <DropdownMenuShortcut>
                  <Copy className="h-4 w-4 ml-auto" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {currentProfile.id === member.id ||
              currentProfile.role === MemberRole.ADMIN ||
              currentProfile.role === MemberRole.MODERATOR ? (
                <DropdownMenuItem
                  onClick={() =>
                    onOpen("deleteMessage", {
                      apiUrl: `${socketUrl}/${message.id}`,
                      query: socketQuery,
                      other: message,
                    })
                  }
                  className="text-red-500 text-sm cursor-pointer hover:text-white hover:bg-red-500 dark:hover:bg-red-500"
                >
                  Delete message
                  <DropdownMenuShortcut>
                    <Trash className="h-4 w-4 ml-auto" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Message;
