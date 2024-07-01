const UNIT_PRICE_STEP = 5;

export function computeUnitPrice(barrelPrice: number, consumptions: number) {
  if (consumptions === 0) return 0;
  const unitPrice = barrelPrice / consumptions;
  const unitPriceSteps = Math.ceil(unitPrice / UNIT_PRICE_STEP);
  return unitPriceSteps * UNIT_PRICE_STEP;
}
