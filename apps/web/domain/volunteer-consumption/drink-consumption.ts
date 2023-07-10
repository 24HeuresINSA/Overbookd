const UNIT_PRICE_STEP = 0.05;

export function computeUnitPrice(barrelPrice: number, consumptions: number) {
  const unitPrice = barrelPrice / consumptions;
  const unitPriceSteps = Math.ceil(unitPrice / UNIT_PRICE_STEP);
  return unitPriceSteps * UNIT_PRICE_STEP;
}
