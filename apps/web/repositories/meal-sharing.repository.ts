import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  IDefineMealDate,
  InMemoryAdherents,
  InMemorySharedMeals,
  MealSharing,
  SharedMeal,
} from "@overbookd/personal-account";

export type Context = { $axios: NuxtAxiosInstance };

const alphonse = {
  id: 223,
  name: "chef",
};

const couscous = SharedMeal.retrieve({
  id: 1,
  meal: { menu: "Couscous", date: "vendredi 20 octobre soir" },
  chef: alphonse,
  shotguns: [{ ...alphonse, date: new Date("2023-10-18") }],
});

const adherents = new InMemoryAdherents(
  new Array(1_000).fill(null).map((_value, index) => ({
    ...alphonse,
    id: index,
  })),
);

const sharedMeals = new InMemorySharedMeals([couscous]);

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
