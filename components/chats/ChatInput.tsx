"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/useModal";
import PreviewFile from "./PreviewFile";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}
const MAX_COUNT = 5;
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const formSchema = z
  .object({
    content: z.string().max(1000),
    fileUrl: z
      .any()
      // .refine(
      //   (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      //   `Max file size is 5MB.`
      // )
      // .refine(
      //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      //   ".jpg, .jpeg, .png and .webp files are accepted."
      // ),
  })
  .refine(
    (data) => {
      // At least one of 'content' or 'fileUrl' must be provided.
      return (
        data.content !== "" ||
        (data.fileUrl !== undefined && data.fileUrl.length > 0 && data.fileUrl?.[0]?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(data.fileUrl?.[0]?.type))
      );
    },
    {
      message: "At least one of 'content' or 'fileUrl' must be provided",
    }
  );

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<File[]>([]);
  const [limit, setLimit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: [],
    },
  });
  const isLoading = form.formState.isSubmitting;

  const convertBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const file = [];
      for (var i = 0; i < values.fileUrl.length; i++) {
        var base = await convertBase64(values.fileUrl[i]);
        file.push(base);
      }
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      const data = {
        content: values.content,
        file: file,
      };
      await axios.post(url, data);
      PlayMessageSound();
      setPreviewImage([]);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  const handlePreviewFile = (files: File[]) => {
    const uploaded = [...previewImage];
    let limitExceeded = false;
    files.some((file) => {
      //if this file is not in file list
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length > MAX_COUNT) {
          setLimit(true);
          limitExceeded = true;
        }
      }
    });
    if (!limitExceeded) {
      setPreviewImage(uploaded);
      setLimit(false);
      form.setValue("fileUrl", uploaded);
    }
  };

  const removeAttachment = useCallback(
    (item: File) => {
      const resetAttachment = () => {
        const newArray = previewImage.filter((f) => f.name !== item.name);
        setPreviewImage(newArray);
        form.setValue("fileUrl", newArray);
      };

      resetAttachment();
    },
    [form, previewImage]
  );
  const { onOpen } = useModal();

  useEffect(() => {
    if (limit) {
      setLimit(false);
      onOpen("warning");
    }
  }, [limit, onOpen]);
  return (
    <Form {...form}>
      <form
        className="relative p-4 pb-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {previewImage.length > 0 ? (
          <>
            <div className="flex gap-5 overflow-x-auto w-full p-4 bg-zinc-200/90 dark:bg-zinc-700/75 rounded-t-md">
              {previewImage.map((item) => {
                return (
                  <PreviewFile
                    key={item.name}
                    item={item}
                    removeAttachment={() => removeAttachment(item)}
                  />
                );
              })}
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
                      const chosen = [...e.target.files];
                      handlePreviewFile(chosen);
                    }}
                    className="hidden"
                    multiple
                  />
                </FormControl>
                <FormMessage/>
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
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
