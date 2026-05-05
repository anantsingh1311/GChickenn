export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function formatCurrency(value) {
  const number = Number(value || 0);
  return currencyFormatter.format(Number.isNaN(number) ? 0 : number);
}
