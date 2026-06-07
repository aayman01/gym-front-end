export function formatPrice(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatPriceRange(
  min: string | null,
  max: string | null,
  base: string,
): string {
  if (min && max && min !== max) {
    return `${formatPrice(min)} – ${formatPrice(max)}`;
  }
  return formatPrice(min ?? max ?? base);
}
