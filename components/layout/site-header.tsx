import Link from "next/link";
import { Dumbbell, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-4" />
          </span>
          <span>Crimson Forge</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#categories" className="transition-colors hover:text-foreground">
            Categories
          </Link>
          <Link href="#products" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="#reviews" className="transition-colors hover:text-foreground">
            Reviews
          </Link>
        </nav>

        <Button variant="outline" size="sm">
          <ShoppingBag />
          Shop Now
        </Button>
      </div>
    </header>
  );
}
