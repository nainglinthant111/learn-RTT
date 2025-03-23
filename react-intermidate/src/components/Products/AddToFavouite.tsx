import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
interface FavouiteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  rating: number;
}
function AddToFavouite({
  productId,
  rating,
  className,
  ...props
}: FavouiteProps) {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      <Icons.heart className={cn("size-4")} />
    </Button>
  );
  console.log(productId, rating);
}

export default AddToFavouite;
