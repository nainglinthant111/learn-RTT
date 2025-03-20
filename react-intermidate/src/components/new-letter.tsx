import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "./icons";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email({
    message: "Please Enter a valid email.",
  }),
});

export default function NewsSelectorForm() {
  const [loding, setLoding] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    setLoding(true);
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full pr-8 lg:pr-0"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="user@gmail.com"
                  {...field}
                  className="pr-12"
                />
              </FormControl>
              <Button
                size="icon"
                className="z-index-20 absolute top-[4px] right-2 right-[3.5px] size-7"
              >
                {loding ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Icons.paperPlane className="size-3" aria-hidden="true" />
                )}
                <span className="sr-only">join newsletter</span>
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
