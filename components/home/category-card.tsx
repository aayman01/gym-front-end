"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicCategory } from "@/types/storefront";

const accentStyles = [
  "from-primary/20 via-transparent to-transparent",
  "from-[rgba(73,34,34,0.45)] via-transparent to-transparent",
  "from-[rgba(196,160,160,0.2)] via-transparent to-transparent",
  "from-primary/10 via-[rgba(242,13,13,0.05)] to-transparent",
];

type CategoryCardProps = {
  category: PublicCategory;
  index: number;
  className?: string;
};

export function CategoryCard({ category, index, className }: CategoryCardProps) {
  const accent = accentStyles[index % accentStyles.length];

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border/60 bg-card p-5",
          className,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100",
            accent,
          )}
        />
        <div className="relative flex min-h-44 flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Category
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                {category.name}
              </h3>
            </div>
            {category.isFeature ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Featured
              </span>
            ) : null}
          </div>

          <div className="relative h-24 overflow-hidden rounded-xl border border-border/50 bg-surface-dim">
            {category.image?.url ? (
              <Image
                src={category.image.url}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Dumbbell className="size-10 text-primary/60" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
