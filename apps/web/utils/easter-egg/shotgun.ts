import { MAX_PORTIONS_PER_GUEST } from "@overbookd/personal-account";

export function getShotgunTitle(
  areMultipleShotgunsAllowed: boolean,
  myPortionCount: number,
): string | undefined {
  if (!areMultipleShotgunsAllowed) return undefined;

  if (myPortionCount >= MAX_PORTIONS_PER_GUEST)
    return "Encore, ça fait beaucoup là non !?";

  if (myPortionCount > 0) return "Gourmand·e 😏";

  return undefined;
}
