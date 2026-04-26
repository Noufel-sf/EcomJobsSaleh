'use client';

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductCardItem = {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  smallDesc: string;
};

export const ProductCard = memo(function ProductCard({
  product,
  // addToCart,
}: {
  product: ProductCardItem;
}) {
  // const [isPending, startTransition] = useTransition();

  // const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   startTransition(async () => {
  //     await addToCart({ id: product.id, name: product.name, image: product.mainImage, price: product.price  });
  //   });
  // };

  return (
    <Card className="h-full border-0 w-full mx-auto overflow-hidden shadow-none">
      <Link href={`/productdetails/${product.id}`} className="block">
        <CardHeader className="p-0 relative">
          {/* Product Image */}
          <div className="relative h-38 w-full">
            <Image
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-contain"
              fill
              loading="lazy"
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 18vw"
              quality={70}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-1 min-h-28">

        
          <h3 className="text-sm font-medium line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 truncate text-sm">
            {product.smallDesc}
          </p>

          <div className="flex items-center">
            <span className="text-lg font-bold text-primary">
              {product.price} {"Dz"}   
            </span>
             
          </div>
        </CardContent>
      </Link>

      <div className="px-4 flex items-center w-full gap-2 min-h-12">
        <Link href={`/productdetails/${product.id}`} className="w-full">
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-primary w-full hover:bg-primary/20"
          disabled={false}
        >
         view details
        </Button>
        </Link>


      </div>
    </Card>
  );
});

export default ProductCard;
