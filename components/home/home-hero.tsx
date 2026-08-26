"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Flame, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { usePublicBanners } from "@/hooks/api/storefront/use-public-banners";

const FALLBACK = {
  title: "Fuel your training with supplements built for serious performance.",
  description:
    "Shop curated protein, pre-workout, creatine, and recovery essentials. Trusted by lifters who want clean formulas, transparent labels, and results they can feel.",
  buttonText: "Shop Supplements",
  buttonLink: "#products",
};

export function HomeHero() {
  const { data: banners } = usePublicBanners();
  const banner = banners?.[0];
  const title = banner?.title || FALLBACK.title;
  const description = banner?.description || FALLBACK.description;
  const buttonText = banner?.buttonText || FALLBACK.buttonText;
  const buttonLink = banner?.buttonLink || FALLBACK.buttonLink;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,13,13,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(73,34,34,0.35),transparent_45%)]" />
      <div className="pointer-events-none absolute -right-16 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 size-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
        <div className="space-y-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Flame className="size-3.5" />
              Premium Gym Supplements
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href={buttonLink} />}>
                {buttonText}
                <ArrowRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="#categories" />}
              >
                Explore Categories
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Zap, label: "Fast-acting formulas" },
                { icon: ShieldCheck, label: "Lab-tested quality" },
                { icon: Flame, label: "Built for intensity" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
                >
                  <item.icon className="mb-2 size-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <motion.div
            className="relative mx-auto aspect-[4/5] max-w-md transform-gpu overflow-hidden rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,var(--surface-container),var(--surface-dim))] shadow-[0_30px_80px_rgba(242,13,13,0.15)]"
            animate={{ y: -10 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.37, 0, 0.63, 1],
            }}
          >
            {banner?.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner.mediaUrl}
                alt={title}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,13,13,0.25),transparent_55%)]" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Featured Stack
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold">Ignite + Forge</h2>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                      Power through your session, then recover with clean protein
                      support.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {["Pre-workout energy", "Whey isolate recovery", "Creatine strength"].map(
                      (line) => (
                        <div
                          key={line}
                          className="rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm"
                        >
                          {line}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
