import { formatPrice } from "@/lib/utils";
import { Cart } from "@/types";
import { Separator } from "@/components/ui/separator";
import Editable from "./Editable";

interface CartProp {
  cart: Cart;
}
function CartItem({ cart }: CartProp) {
  return (
    <div className="space-y-3 px-4">
      <div className="flex gap-4">
        <img
          src={cart.image.url}
          alt={cart.image.name}
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} X {cart.quantity} ={" "}
            {formatPrice(cart.price * cart.quantity)}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs capitalize">
            {cart.category} / {cart.subcategory}
          </span>
        </div>
      </div>
      <Editable />
      <Separator className="mb-4" />
    </div>
  );
}
export default CartItem;
