import {
  Expense,
  IExposePastMeal,
  IExposeSharedMeal,
  IInformAboutMeal,
} from "./meals.model";
import { Meal } from "./meal";
import { IDefineMealDate } from "./meal-sharing";
import { Adherent } from "./adherent";
import { Shotgun } from "./adherent";
import { PastMeal } from "./past-meal";

type IInitSharedMeal = {
  id: number;
  menu: string;
  date: IDefineMealDate;
  chef: Adherent;
};

type IRetrieveSharedMeal = {
  id: number;
  meal: IInformAboutMeal;
  chef: Adherent;
  shotguns: Shotgun[];
};

export class SharedMeal implements IExposeSharedMeal {
  private constructor(
    readonly id: number,
    readonly meal: IInformAboutMeal,
    readonly chef: Adherent,
    private readonly _shotguns: Shotgun[],
  ) {}

  static init({ id, menu, date, chef }: IInitSharedMeal): SharedMeal {
    const meal = Meal.init(menu, date);
    return new SharedMeal(id, meal, chef, [{ ...chef, date: new Date() }]);
  }

  static retrieve({
    id,
    meal,
    chef,
    shotguns,
  }: IRetrieveSharedMeal): SharedMeal {
    return new SharedMeal(id, meal, chef, shotguns);
  }

  get shotguns(): number {
    return this._shotguns.length;
  }

  hasShotgun(adherent: Adherent): boolean {
    return this._shotguns.some(({ id }) => id === adherent.id);
  }

  shotgunFor(adherent: Adherent): IExposeSharedMeal {
    if (this.hasShotgun(adherent)) return this;
    const shotgun = { ...adherent, date: new Date() };
    const shotguns = [...this._shotguns, shotgun];
    return new SharedMeal(this.id, this.meal, this.chef, shotguns);
  }

  close(expense: Expense): IExposePastMeal {
    return PastMeal.init({
      id: this.id,
      meal: this.meal,
      chef: this.chef,
      shotguns: this._shotguns,
      expense,
    });
  }
}
