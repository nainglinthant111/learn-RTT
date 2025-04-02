import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Icons } from "../icons";
import { Separator } from "@/components/ui/separator";
import { cartItems } from "@/data/carts";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import CartItem from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils.ts";
function ShoppingCartSheet() {
  const itemCount = 4;
  const amountTotal = 190;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={"icon"}
          className={"relative"}
          aria-label={"Open Cart"}
        >
          <Badge
            variant={"destructive"}
            className="absolute -top-2 -right-2 size-6 justify-center rounded-full p-2.5"
          >
            {itemCount}
          </Badge>
          <Icons.cart className="size-4" aria-hidden={true} />
        </Button>
      </SheetTrigger>
      <SheetContent className={"w-full md:max-w-md"}>
        <SheetHeader>
          <SheetTitle className={"text-center"}>Cart - {itemCount}</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="size-full">
              {cartItems.map((cart) => (
                <CartItem cart={cart} />
              ))}
            </ScrollArea>
            <Separator />
            <div className="mt-4 space-y-3">
              <div className="flex justify-between px-4">
                <span className="">Shipping</span>
                <span className="">Free</span>
              </div>
              <div className="flex justify-between px-4">
                <span className="">Taxes</span>
                <span className="">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between px-4">
                <span className="">Total</span>
                <span className="">{formatPrice(amountTotal.toFixed(2))}</span>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" asChild aria-label={"to checkout"}>
                  <Link to="/checkout">Continue To Checkout</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.cart className={"text-muted-foreground mb-4 size-16"} />
            <div className="text-muted-foreground text-xl font-medium">
              Your Cart is Empty
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ShoppingCartSheet;
