import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  IDefineMealDate,
  InMemoryAdherents,
  InMemorySharedMeals,
  MealSharing,
} from "@overbookd/personal-account";

export type Context = { $axios: NuxtAxiosInstance };

const alphonse = {
  id: 223,
  name: "chef",
};

const adherents = new InMemoryAdherents(
  new Array(1_000).fill(null).map((_value, index) => ({
    ...alphonse,
    id: index,
  })),
);

const sharedMeals = new InMemorySharedMeals();

const mealSharing = new MealSharing(sharedMeals, adherents);

type SharedMealCreation = {
  menu: string;
  date: IDefineMealDate;
  chefId: number;
};

export class MealSharingRepository {
  static async offer(
    _contex: Context,
    { menu, date, chefId }: SharedMealCreation,
  ) {
    const meal = await mealSharing.offer(menu, date, chefId);
    return Promise.resolve({ data: meal });
  }

  static async find(_contex: Context, mealId: number) {
    const meal = await sharedMeals.find(mealId);
    if (!meal) return Promise.resolve(undefined);

    return Promise.resolve({ data: meal });
  }
}
