import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Icons } from "@/components/icons";

const quantitySchema = z.object({
  quantity: z.number().min(0).default(1),
});

export default function Editable() {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof quantitySchema>) {
    console.log(values);
    toast.success("Product is Add To Cart.");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-[2660] justify-between"
      >
        <div className="flex items-center">
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            className="size-8 shrink-0 rounded-r-none"
          >
            <Icons.minusIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove One Item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    inputMode="numeric"
                    min={0}
                    className="h-8 w-16 rounded-none border-x-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            className="size-8 shrink-0 rounded-l-none"
          >
            <Icons.plusIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">Add One Item</span>
          </Button>
        </div>

        <Button
          type="button"
          className="size-8"
          variant={"outline"}
          size="icon"
          aria-label="delete"
        >
          <Icons.trash className="size-3" aria-hidden="true" />
          <span className="sr-only">Delete Item</span>
        </Button>
      </form>
    </Form>
  );
}
