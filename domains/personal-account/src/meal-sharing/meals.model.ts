import { Adherent } from "./adherent";

export type Expense = {
  amount: number;
  date: Date;
};

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
  close(expense: Expense): IExposePastMeal;
};

export type EndSharedMeal = {
  chef: Adherent;
  date: string;
  guests: number[];
  amount: number;
};

export type IExposePastMeal = BaseSharedMeal & {
  shotgunFor(adherent: Adherent): IExposeSharedMeal;
  amount: number;
  inTimeShotguns: number;
  event: EndSharedMeal;
};

export function isPastMeal(
  meal: IExposeSharedMeal | IExposePastMeal,
): meal is IExposePastMeal {
  return "expense" in meal;
}
