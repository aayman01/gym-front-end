"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductReviews } from "@/hooks/api/storefront/use-public-reviews";
import type { ProductReview } from "@/types/storefront";

type Props = { productId: string };

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "size-4",
            s <= rating ? "fill-primary text-primary" : "fill-none text-muted-foreground/50",
          )}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <li className="space-y-3 rounded-xl border border-border/60 bg-card/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Stars rating={review.rating} />
        <div className="flex items-center gap-2">
          {review.isVerifiedPurchase && (
            <Badge variant="secondary" className="text-[10px]">
              Verified purchase
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>

      {review.comment && (
        <p className="text-sm leading-6 text-muted-foreground">{review.comment}</p>
      )}

      {review.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.images.map((img) => (
            <div
              key={img.id}
              className="relative size-16 overflow-hidden rounded-lg border border-border/60"
            >
              <Image
                src={img.url}
                alt="Review image"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

export function ProductReviews({ productId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProductReviews(productId, page);

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  return (
    <section className="mt-16 border-t border-border/60 pt-10">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <MessageSquare className="size-5 text-primary" />
        Customer reviews
        {meta && meta.total > 0 && (
          <span className="text-sm font-normal text-muted-foreground">
            ({meta.total})
          </span>
        )}
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Could not load reviews right now.
        </p>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-12 text-center">
          <MessageSquare className="size-8 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No reviews yet</p>
          <p className="text-sm text-muted-foreground">
            Be the first to review this product after your purchase.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ul>

          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPrevious}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNext}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
