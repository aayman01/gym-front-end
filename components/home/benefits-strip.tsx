import { Headphones, ShieldCheck, Truck, Verified } from "lucide-react";
import { Reveal } from "@/components/home/reveal";

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your stack quickly with reliable shipping on every order.",
  },
  {
    icon: Verified,
    title: "Verified Quality",
    description: "Transparent labels and formulas you can trust before every scoop.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Protected payments and a smooth buying experience from cart to door.",
  },
  {
    icon: Headphones,
    title: "Nutrition Support",
    description: "Guidance to help you choose the right products for your goals.",
  },
];

export function BenefitsStrip() {
  return (
    <section className="border-b border-border/60 bg-surface-dim/50 py-14 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 md:px-6 xl:grid-cols-4">
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delay={index * 0.05}>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
              <benefit.icon className="mb-4 size-6 text-primary" />
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
