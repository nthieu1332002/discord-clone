"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/emoji-picker";
import { PlayMessageSound } from "@/components/PlayMessageSound";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import CustomTooltip from "../custom-tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1).max(1000),
  fileUrl: z.union([z.undefined(), z.instanceof(File)]), //undefinable || file only
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<File>();
  const [spoiler, setSpoiler] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: undefined,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      // await axios.post(url, values);
      PlayMessageSound();
      setPreviewImage(undefined);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  const removeAttachment = useCallback(() => {
    const resetAttachment = () => {
      setPreviewImage(undefined);
      form.setValue("fileUrl", undefined);
    };

    resetAttachment();
  }, [form]);
  return (
    <Form {...form}>
      <form
        className="relative p-4 pb-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {previewImage ? (
          <>
            <div className="w-full p-4 bg-zinc-200/90 dark:bg-zinc-700/75 rounded-t-md">
              <div className="relative flex flex-col justify-between p-2 w-[215px] h-[215px] dark:bg-[#2b2d31] bg-zinc-300 rounded-sm">
                <div className="absolute -right-5 -top-[2px] z-10">
                  <div className="grid grid-flow-col rounded-md overflow-hidden hover:shadow-md">
                    <CustomTooltip
                      side="top"
                      align="center"
                      label="Spoiler Attachment"
                    >
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
                    
                    <CustomTooltip
                      side="top"
                      align="center"
                      label="Remove Attachment"
                    >
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
                  <Image
                    src={URL.createObjectURL(previewImage)}
                    alt="preview"
                    layout="fill"
                    objectFit="contain"
                    className={cn(spoiler ? "blur-lg" : "")}
                  />
                </div>
                <p className="text-sm truncate text-zinc-800 dark:text-zinc-300 ">
                  {previewImage.name}
                </p>
              </div>
            </div>
            <Separator className="h-[0.1px] w-full dark:bg-zinc-400 bg-zinc-700" />
          </>
        ) : null}
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <FormItem>
                <FormLabel className="absolute bottom-9 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                  <Plus className="text-white dark:text-[#313338]" />
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    onChange={(e) => {
                      setPreviewImage(e.target.files[0]);
                      onChange(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message # ${name}`}
                    autoComplete="off"
                    {...field}
                  />
                  <div className="absolute bottom-[30px] right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
