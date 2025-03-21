import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import type { Product } from "@/types";
import { Link } from "react-router-dom";

interface ProductProps {
  products: Product[];
}
export default function CarouselCard({ products }: ProductProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
      }}
      className="w-full px-3 lg:px-0"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-1/1 lg:basis-1/3">
            <div className="flex gap-4 p-4 lg:px-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="size-28 rounded-md"
              />
              <div className="">
                <h3 className="text-bold text-sm">{product.name}</h3>
                <p className="my-2 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="text-semibold text-sm text-[#3b5d50] hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden" />
      <CarouselNext className="hidden" />
    </Carousel>
  );
}
