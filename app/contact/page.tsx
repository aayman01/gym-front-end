"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import { useSiteSettingsStore } from "@/stores/site-settings-store";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Required").max(150),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().max(50).optional(),
  subject: z.string().max(255).optional(),
  message: z.string().trim().min(1, "Required").max(5000),
});

type ContactValues = z.infer<typeof contactSchema>;

const inputCls =
  "h-10 w-full rounded-lg border border-border/60 bg-background/80 px-3 text-sm outline-none focus-visible:border-primary";

export default function ContactPage() {
  const isLoaded = useSiteSettingsStore((s) => s.isLoaded);
  const contactPhone = useSiteSettingsStore((s) => s.settings?.contactPhone);
  const contactEmail = useSiteSettingsStore((s) => s.settings?.contactEmail);
  const contactAddress = useSiteSettingsStore(
    (s) => s.settings?.contactAddress,
  );
  const contactFormEnabled =
    useSiteSettingsStore((s) => s.settings?.contactFormEnabled) ?? true;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const hasContact = Boolean(contactPhone || contactEmail || contactAddress);

  const onSubmit = handleSubmit(
    async (values, event) => {
      // Honeypot is uncontrolled (not in RHF) so autofill can't block validation
      const form = event?.target;
      if (form instanceof HTMLFormElement) {
        const hp = new FormData(form).get("company_url_hp");
        if (typeof hp === "string" && hp.trim().length > 0) {
          toast.success("Message sent — we'll get back to you soon");
          reset();
          return;
        }
      }

      try {
        await api.post("/public/contact", {
          name: values.name,
          email: values.email,
          phone: values.phone?.trim() || null,
          subject: values.subject?.trim() || null,
          message: values.message,
          website: "",
        });
        toast.success("Message sent — we'll get back to you soon");
        reset();
      } catch (err) {
        toast.error(
          err instanceof ApiError
            ? err.message
            : (err as { message?: string })?.message ?? "Failed to send message",
        );
      }
    },
    () => {
      toast.error("Please fix the highlighted fields");
    },
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
        <p className="mt-2 text-muted-foreground">
          Reach the team with product questions, order help, or partnership
          inquiries.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Get in touch
          </h2>
          {!isLoaded ? (
            <div className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-muted/40" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted/40" />
            </div>
          ) : hasContact ? (
            <ul className="space-y-3 text-sm">
              {contactPhone ? (
                <li>
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="size-4 text-primary" />
                    {contactPhone}
                  </a>
                </li>
              ) : null}
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="size-4 text-primary" />
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {contactAddress ? (
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="whitespace-pre-line">{contactAddress}</span>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Contact details will appear here once configured.
            </p>
          )}
        </aside>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
          {!isLoaded ? (
            <div className="h-64 animate-pulse rounded-xl bg-muted/30" />
          ) : contactFormEnabled ? (
            <form
              onSubmit={onSubmit}
              className="relative space-y-4"
              autoComplete="off"
            >
              <h2 className="font-semibold">Send an inquiry</h2>

              {/* Uncontrolled honeypot — not registered with RHF */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
              >
                <input
                  type="text"
                  name="company_url_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" className={inputCls} {...register("name")} />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className={inputCls}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className={inputCls}
                    {...register("phone")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject (optional)</Label>
                  <Input
                    id="subject"
                    className={inputCls}
                    {...register("subject")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  rows={5}
                  className={`${inputCls} h-auto resize-y py-2`}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-2 py-8 text-center">
              <p className="font-medium">Contact form unavailable</p>
              <p className="text-sm text-muted-foreground">
                Please reach us using the phone or email listed
                {hasContact ? " on the left" : ""}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
