export function formatPrice(cents: number) {
  return `Rs. ${(cents / 100).toLocaleString()}`;
}
