"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPriceRange } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/products/wishlist-button";
import type { PublicProductCard } from "@/types/storefront";

type ProductCardProps = {
  product: PublicProductCard;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const price = formatPriceRange(
    product.minPrice,
    product.maxPrice,
    product.basePrice,
  );
  const rating = Number.parseFloat(product.rating);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("h-full", className)}
    >
      <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-dim">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(242,13,13,0.18),transparent_55%),linear-gradient(180deg,var(--surface-container),var(--surface-dim))]">
              <Package className="size-12 text-primary/70" />
            </div>
          )}
          {product.category ? (
            <Link
              href={`/categories/${product.category.slug}`}
              className="absolute left-3 top-3 z-10"
            >
              <Badge className="bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground">
                {product.category.name}
              </Badge>
            </Link>
          ) : null}
          <WishlistButton
            productId={product.id}
            className="absolute right-3 top-3 z-10"
          />
        </div>

        <CardHeader className="gap-2">
          {product.brand ? (
            <Link
              href={`/brands/${product.brand.slug}`}
              className="w-fit text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
            >
              {product.brand.name}
            </Link>
          ) : null}
          <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
          {product.summary ? (
            <CardDescription className="line-clamp-2">
              {product.summary}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardContent className="mt-auto flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-primary">{price}</p>
          {!Number.isNaN(rating) ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-4 fill-primary text-primary" />
              <span>{rating.toFixed(1)}</span>
            </div>
          ) : null}
        </CardContent>

        <CardFooter>
          <Link href={`/products/${product.slug}`} className="w-full">
            <Button className="w-full">View Product</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
