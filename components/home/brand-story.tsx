"use client";

import { motion } from "motion/react";
import { CheckCircle2, FlaskConical, Target } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";

const bullets = [
  "Clean ingredient profiles with no unnecessary fillers.",
  "Formulas designed for strength, endurance, and recovery.",
  "Performance-first packaging and dosing you can trust.",
];

export function BrandStory() {
  return (
    <section className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Why Crimson Forge"
            title="Built for lifters who care about what goes in their body"
            description="We focus on transparent formulas, consistent quality, and products that support every phase of your training journey."
          />

          <ul className="mt-8 space-y-4">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm leading-6">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card p-8"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,13,13,0.18),transparent_50%)]" />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <FlaskConical className="size-3.5" />
                Performance Lab
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Target, title: "Goal-based stacks", text: "Match products to your training phase." },
                  { icon: FlaskConical, title: "Clean formulas", text: "No hype ingredients, just what works." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/50 bg-background/50 p-5"
                  >
                    <item.icon className="mb-3 size-5 text-primary" />
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/50 bg-surface-dim p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  From your first scoop of whey to your heaviest training block,
                  Crimson Forge helps you build a supplement routine that feels
                  intentional, not overwhelming.
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
