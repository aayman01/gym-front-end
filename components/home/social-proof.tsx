"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";

const testimonials = [
  {
    name: "Marcus Reed",
    role: "Powerlifter",
    quote:
      "The pre-workout hits clean and the protein mixes smooth. This is my go-to stack now.",
    rating: 5,
  },
  {
    name: "Elena Ortiz",
    role: "CrossFit Athlete",
    quote:
      "I love how transparent the labels are. I can actually feel the difference in recovery.",
    rating: 5,
  },
  {
    name: "Jordan Hale",
    role: "Coach",
    quote:
      "I recommend these supplements to clients who want quality without overcomplicated formulas.",
    rating: 4,
  },
];

const stats = [
  { label: "Average rating", value: "4.8/5" },
  { label: "Repeat customers", value: "72%" },
  { label: "Orders shipped", value: "18k+" },
];

export function SocialProof() {
  return (
    <section id="reviews" className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Social Proof"
            title="Trusted by athletes who train hard"
            description="Real feedback from lifters, coaches, and everyday athletes building better routines."
            align="center"
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.05}>
              <Card className="border-border/60 bg-card/70 text-center">
                <CardContent className="py-8">
                  <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full border-border/60 bg-[linear-gradient(180deg,var(--card),var(--surface-dim))]">
                  <CardContent className="space-y-5 py-6">
                    <div className="flex items-center justify-between">
                      <Quote className="size-5 text-primary" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-foreground">
                      “{item.quote}”
                    </p>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <Badge variant="outline" className="mt-2">
                        {item.role}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
