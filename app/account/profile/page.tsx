"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useChangePassword,
  useCustomerSession,
  useUpdateProfile,
} from "@/hooks/api/storefront/use-customer-auth";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: customer } = useCustomerSession();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: (customer as { phone?: string | null }).phone ?? "",
      });
    }
  }, [customer, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || null,
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Update failed");
    }
  });

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input
            value={customer?.email ?? ""}
            disabled
            className="cursor-not-allowed opacity-60"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed at this time.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" placeholder="+1 555 000 0000" {...register("phone")} />
        </div>

        <Button
          type="submit"
          disabled={!isDirty || updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <><Loader2 className="mr-2 size-4 animate-spin" /> Saving...</>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>

      <form
        onSubmit={passwordForm.handleSubmit(async (values) => {
          try {
            await changePassword.mutateAsync({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            });
            toast.success("Password updated");
            passwordForm.reset();
          } catch (err) {
            toast.error((err as { message?: string })?.message ?? "Update failed");
          }
        })}
        className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6"
      >
        <h2 className="font-semibold">Change password</h2>
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            {...passwordForm.register("currentPassword")}
          />
          {passwordForm.formState.errors.currentPassword && (
            <p className="text-xs text-destructive">
              {passwordForm.formState.errors.currentPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            {...passwordForm.register("newPassword")}
          />
          {passwordForm.formState.errors.newPassword && (
            <p className="text-xs text-destructive">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...passwordForm.register("confirmPassword")}
          />
          {passwordForm.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {passwordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={changePassword.isPending}>
          {changePassword.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}
