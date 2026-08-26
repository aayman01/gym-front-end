import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoryView } from "@/components/products/category-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${name} | Crimson Forge`,
    description: `Browse performance-grade gym supplements in ${name}.`,
  };
}

function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-16 animate-pulse rounded-full bg-primary/20" />
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/40" />
        <div className="h-4 w-96 animate-pulse rounded-full bg-muted/30" />
      </div>
      <div className="flex gap-8">
        <div className="hidden w-60 shrink-0 md:block">
          <div className="h-125 animate-pulse rounded-xl bg-muted/40" />
        </div>
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryView slug={slug} />
    </Suspense>
  );
}
