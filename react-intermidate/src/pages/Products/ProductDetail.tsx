import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Link, useParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "@/components/Products/ProductCard";
import { Icons } from "@/components/icons";
import Autoplay from "embla-carousel-autoplay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Rating from "@/components/Products/Rating";
import AddToFavouite from "@/components/Products/AddToFavouite";
import AddToCart from "@/components/Products/AddToCart";

function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((post) => post.id === productId);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );
  return (
    <div className="container mx-auto px-4 lg:px-16">
      <Button asChild variant={"outline"} className="mt-8">
        <Link to="/products">
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All Products
        </Link>
      </Button>
      <section className="my-6 flex flex-col gap-16 md:flex-row">
        <Carousel plugins={[plugin.current]} className="w-full md:w-1/2">
          <CarouselContent>
            {product?.images.map((item) => (
              <CarouselItem key={item}>
                <div className="p-1">
                  <img
                    src={item}
                    alt={product.name}
                    className="size-full rounded-md object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product?.name}</h2>
            <p className="text-muted-foreground text-base">
              {formatPrice(Number(product?.price))}
            </p>
          </div>
          <Separator className="my-1.5" />
          <p className="text-muted-foreground text-base">
            {product?.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={Number(product?.rating)} />
            <AddToFavouite
              productId={String(productId)}
              rating={Number(product?.rating)}
            />
          </div>
          <AddToCart canBuy={product?.status === "active" ? true : false} />
          <Separator className="my-5" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product?.description ??
                  "No Description is avalible for this product"}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="space-y-6 overflow-hidden">
        <h2 className="line-clamp-1 text-2xl font-bold">
          More Products From Furnitrue Shop
        </h2>
        <ScrollArea className="w-full pb-8">
          <div className="flex gap-4">
            {products.splice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                className="min-w-[260px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}

export default ProductDetail;
