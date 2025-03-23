import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Icons } from "../icons";
import { formatPrice } from "@/lib/utils";
interface ProductProops {
  product: Product;
}
function ProductCard({ product }: ProductProops) {
  return (
    <Card className="w-full overflow-hidden rounded-lg pt-0">
      <Link to={`/products/${product.id}`} aria-label="product.name">
        <CardHeader className="gap-0 p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={product.images[0]}
              alt={product.name}
              className="m-0 size-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
      </Link>
      <CardContent className="space-y-1.5 p-4">
        <CardTitle className="text-bold line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {formatPrice(product.price)}
          {product.discount > 0 && (
            <span className="ml-2 font-extralight line-through">
              {formatPrice(product.discount)}
            </span>
          )}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-1">
        {product.status === "sold" ? (
          <Button
            className="h-8 w-full rounded-sm font-bold"
            disabled={true}
            aria-label="Sold Out"
            size="sm"
          >
            Sold Out
          </Button>
        ) : (
          <Button
            className="h-8 w-full rounded-sm bg-[#3b5d50] font-bold text-white"
            size="sm"
            aria-label="Add To Cart"
          >
            <Icons.plusIcon className="" />
            Add To Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
