"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";

export function HomeCta() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-[linear-gradient(135deg,rgba(242,13,13,0.18),rgba(20,8,8,0.95))] px-6 py-12 md:px-10 md:py-16">
            <div className="pointer-events-none absolute -right-10 top-0 size-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative max-w-2xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Start Your Stack
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Build a supplement routine that matches your training goals.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Browse categories, compare top-rated products, and put together a
                stack that supports strength, energy, and recovery.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="#products" />}>
                  Start Building Your Stack
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="#categories" />}
                >
                  Browse Categories
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
