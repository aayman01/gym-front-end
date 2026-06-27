"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useCreateAddress,
  useCustomerAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/hooks/api/storefront/use-customer-addresses";
import type { CustomerAddress, CreateAddressInput } from "@/types/customer";

const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  addressLine1: z.string().min(1, "Required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Required"),
  stateOrDivision: z.string().min(1, "Required"),
  postalCode: z.string().optional(),
  country: z.string().length(2, "2-letter code"),
  isDefault: z.boolean().optional(),
});

type AddressValues = z.infer<typeof addressSchema>;

function AddressForm({
  defaultValues,
  onCancel,
  onSave,
  isPending,
}: {
  defaultValues?: Partial<AddressValues>;
  onCancel: () => void;
  onSave: (values: AddressValues) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? { country: "US" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="space-y-4 rounded-2xl border border-primary/30 bg-card/60 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Label (optional)</Label>
          <Input placeholder="Home, Work..." {...register("label")} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" {...register("isDefault")} className="accent-primary" />
            Set as default
          </label>
        </div>
        <div className="space-y-1.5">
          <Label>Full name *</Label>
          <Input placeholder="John Doe" {...register("recipientName")} />
          {errors.recipientName && (
            <p className="text-xs text-destructive">{errors.recipientName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Phone *</Label>
          <Input placeholder="+1 555 000 0000" {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Address line 1 *</Label>
          <Input placeholder="Street address" {...register("addressLine1")} />
          {errors.addressLine1 && (
            <p className="text-xs text-destructive">{errors.addressLine1.message}</p>
          )}
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Address line 2 (optional)</Label>
          <Input placeholder="Apartment, suite..." {...register("addressLine2")} />
        </div>
        <div className="space-y-1.5">
          <Label>City *</Label>
          <Input placeholder="City" {...register("city")} />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>State / Division *</Label>
          <Input placeholder="State" {...register("stateOrDivision")} />
          {errors.stateOrDivision && (
            <p className="text-xs text-destructive">{errors.stateOrDivision.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Postal code (optional)</Label>
          <Input placeholder="10001" {...register("postalCode")} />
        </div>
        <div className="space-y-1.5">
          <Label>Country code *</Label>
          <Input placeholder="US" maxLength={2} {...register("country")} />
          {errors.country && (
            <p className="text-xs text-destructive">{errors.country.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <><Loader2 className="mr-2 size-4 animate-spin" />Saving...</> : "Save address"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const { data: addresses = [], isLoading } = useCustomerAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = async (values: AddressValues) => {
    try {
      await createAddress.mutateAsync(values as CreateAddressInput);
      toast.success("Address saved");
      setAdding(false);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Failed to save");
    }
  };

  const handleUpdate = async (id: string, values: AddressValues) => {
    try {
      await updateAddress.mutateAsync({ id, payload: values });
      toast.success("Address updated");
      setEditingId(null);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Failed to update");
    }
  };

  const handleDelete = async (addr: CustomerAddress) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress.mutateAsync(addr.id);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your saved shipping addresses.
          </p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)} size="sm">
            <Plus className="mr-1.5 size-4" />
            Add address
          </Button>
        )}
      </div>

      {adding && (
        <AddressForm
          onCancel={() => setAdding(false)}
          onSave={handleCreate}
          isPending={createAddress.isPending}
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-muted/40"
            />
          ))}
        </div>
      ) : addresses.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <MapPin className="mb-3 size-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No addresses yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add an address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <div key={addr.id} className="sm:col-span-2">
                <AddressForm
                  defaultValues={{
                    label: addr.label ?? "",
                    recipientName: addr.recipientName,
                    phone: addr.phone,
                    addressLine1: addr.addressLine1,
                    addressLine2: addr.addressLine2 ?? "",
                    city: addr.city,
                    stateOrDivision: addr.stateOrDivision,
                    postalCode: addr.postalCode ?? "",
                    country: addr.country,
                    isDefault: addr.isDefault,
                  }}
                  onCancel={() => setEditingId(null)}
                  onSave={(values) => handleUpdate(addr.id, values)}
                  isPending={updateAddress.isPending}
                />
              </div>
            ) : (
              <div
                key={addr.id}
                className={cn(
                  "relative rounded-xl border bg-card/60 p-5",
                  addr.isDefault
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border/60",
                )}
              >
                {addr.isDefault && (
                  <span className="absolute right-4 top-3 flex items-center gap-1 text-xs font-medium text-primary">
                    <Star className="size-3 fill-primary" />
                    Default
                  </span>
                )}
                {addr.label && (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {addr.label}
                  </p>
                )}
                <div className="space-y-0.5 text-sm">
                  <p className="font-medium">{addr.recipientName}</p>
                  <p className="text-muted-foreground">{addr.phone}</p>
                  <p className="text-muted-foreground">{addr.addressLine1}</p>
                  {addr.addressLine2 && (
                    <p className="text-muted-foreground">{addr.addressLine2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {addr.city}, {addr.stateOrDivision} {addr.postalCode}
                  </p>
                  <p className="text-muted-foreground">{addr.country}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(addr.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault.mutate(addr.id)}
                      disabled={setDefault.isPending}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
                    >
                      <Star className="size-3.5" />
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(addr)}
                    disabled={deleteAddress.isPending}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
