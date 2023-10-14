import { Adherent } from "./adherent";

export type IInformAboutMeal = { menu: string; date: string };

type BaseSharedMeal = {
  id: number;
  meal: IInformAboutMeal;
  chef: Adherent;
  shotguns: number;
};

export type IExposeSharedMeal = BaseSharedMeal & {
  hasShotgun(adherent: Adherent): boolean;
  shotgunFor(adherent: Adherent): IExposeSharedMeal;
  shotgunsBefore(date: Date): number;
};

export type IExposePastMeal = BaseSharedMeal & {
  shotgunFor(adherent: Adherent): IExposeSharedMeal;
  amount: number;
  inTimeShotguns: number;
};

export function isPastMeal(
  meal: IExposeSharedMeal | IExposePastMeal,
): meal is IExposePastMeal {
  return "expense" in meal;
}
