"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Hash, Volume2Icon } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ChannelType } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required.",
  }),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const { channel, other } = data;
  console.log("data", data);
  const router = useRouter();
  const isModalOpen = isOpen && type === "editChannel";
  const [inputValue, setInputValue] = useState(channel?.name);

  const handleChange = (e: any) => {
    const value = e.target.value;
    const transformedValue = value.replace(/\s+/g, "-").replace(/-+/g, "-");
    setInputValue(transformedValue);
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name ? channel.name : "",
      type: channel?.type ? channel.type : ChannelType.TEXT,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          categoryId: other.id,
          serverId: other.serverId,
        },
      });
      await axios.patch(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const selectItem = [
    {
      id: 1,
      name: ChannelType.TEXT,
      icon: <Hash />,
      description: "Send messages, images, GIFs, emoji, opinions and puns",
    },
    {
      id: 2,
      name: ChannelType.VOICE,
      icon: <Volume2Icon />,
      description: "Hang out together with voice, video, and screen share",
    },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#2B2D31] text-zinc-500 dark:text-gray-200 p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-xl font-semibold">
            Edit Channel {channel?.name ? channel.name : null}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="uppercase text-xs font-bold ">
                      channel type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {selectItem.map((item) => (
                          <FormItem
                            key={item.id}
                            className={cn(
                              "cursor-pointer flex items-center justify-between rounded-md px-4 py-3 text-base text-zinc-400",
                              field.value === item.name
                                ? "bg-zinc-800 dark:bg-zinc-700"
                                : "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 dark:bg-zinc-800 transition"
                            )}
                          >
                            <FormLabel className="cursor-pointer flex items-center gap-3 font-normal">
                              {item.icon}
                              <div className="flex flex-col gap-1">
                                <p
                                  className={cn(
                                    "dark:text-gray-200",
                                    field.value !== item.name
                                      ? "text-zinc-800"
                                      : "text-zinc-100"
                                  )}
                                >
                                  {item.name}
                                </p>
                                <span className="text-xs">
                                  {item.description}
                                </span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value={item.name} />
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold ">
                        channel name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="new-channel"
                          icon={
                            form.getValues().type === ChannelType.TEXT ? (
                              <Hash className="h-4 w-4" />
                            ) : (
                              <Volume2Icon className="h-4 w-4" />
                            )
                          }
                          onChange={(event) => {
                            handleChange(event);
                            field.onChange(event); // trigger the field's onChange function
                          }}
                          value={inputValue}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <p className="text-center text-xs text-muted-foreground">hoặc</p>
              <div className="border-[1px] border-red-500 rounded-md p-3">
                <p className="text-base font-semibold">Delete this channel</p>
                <p className="text-sm text-muted-foreground">
                  Once you delete a channel there is no going back. Please be
                  certain.
                </p>
                <Button
                  className="mt-1"
                  size="sm"
                  variant="destructive"
                  disabled={isLoading}
                  onClick={() => onOpen("deleteChannel", { channel: channel, other: other})}
                >
                  Delete this channel
                </Button>
              </div>
            </div>
            <DialogFooter className="bg-white dark:bg-zinc-800 flex items-center text-sm gap-2 px-6 py-4">
              <p
                className="cursor-pointer hover:underline"
                onClick={handleClose}
              >
                Cancel
              </p>
              <Button variant="primary" disabled={isLoading}>
                Edit Channel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
