"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Hash, HashIcon, Volume2Icon } from "lucide-react";
import { iconMap } from "@/components/categories/CategoryItem";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required.",
  }),
});

export const CreateCategoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { other } = data;
  const router = useRouter();
  const params = useParams();
  const isModalOpen = isOpen && type === "createCategory";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      const url = qs.stringifyUrl({
        url: "/api/categories",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);

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


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#2B2D31] text-zinc-500 dark:text-gray-200 p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-xl font-semibold">
            Create Category
          </DialogTitle>
          {other?.name ? (
            <DialogDescription className="">in {other.name}</DialogDescription>
          ) : null}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold ">
                      category name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="New Category"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-white dark:bg-zinc-800 flex items-center text-sm gap-2 px-6 py-4">
              <p
                className="cursor-pointer hover:underline"
                onClick={handleClose}
              >
                Cancel
              </p>
              <Button variant="primary" disabled={isLoading}>
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
