import type {
  OnGoingSharedMeal,
  SharedMeal,
  SharedMeals,
  SharedMealBuilder,
  SharedMealCreation,
  PastSharedMeal,
  Expense,
} from "@overbookd/personal-account";
import { OnGoingSharedMealBuilder } from "@overbookd/personal-account";
import { PastSharedMealBuilder } from "@overbookd/personal-account";
import { numberGenerator } from "@overbookd/list";
import { PrismaService } from "../../prisma.service";
import { nicknameOrName } from "@overbookd/user";

const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};
const SELECT_SHOTGUN = { guest: { select: SELECT_ADHERENT }, date: true };
const SELECT_SHARED_MEAL = {
  id: true,
  menu: true,
  date: true,
  chef: { select: SELECT_ADHERENT },
  amount: true,
  payedAt: true,
  shotguns: { select: SELECT_SHOTGUN },
};

export class PrismaMeals implements SharedMeals {
  private idGenerator: Generator<number>;

  constructor(
    private readonly prisma: PrismaService,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId);
  }

  async create(meal: SharedMealCreation): Promise<OnGoingSharedMeal> {
    const id = this.idGenerator.next().value;
    const onGoingMeal = OnGoingSharedMealBuilder.init({ ...meal, id });
    const saved = await this.prisma.sharedMeal.create({
      data: {
        menu: onGoingMeal.meal.menu,
        date: onGoingMeal.meal.date,
        chefId: onGoingMeal.chef.id,
        shotguns: {
          createMany: {
            data: onGoingMeal.shotguns.map((shotgun) => ({
              guestId: shotgun.id,
              date: shotgun.date,
            })),
          },
        },
      },
      select: SELECT_SHARED_MEAL,
    });
    return buildSharedMeal(saved);
  }

  async find(mealId: number): Promise<SharedMealBuilder | undefined> {
    const saved = await this.prisma.sharedMeal.findUnique({
      where: { id: mealId },
      select: SELECT_SHARED_MEAL,
    });
    if (!saved) return undefined;
    return buildSharedMeal(saved);
  }

  async addShotgun(meal: OnGoingSharedMeal): Promise<OnGoingSharedMeal> {
    const saved = await this.prisma.sharedMeal.update({
      where: { id: meal.id },
      select: SELECT_SHARED_MEAL,
      data: {
        shotguns: {
          upsert: meal.shotguns.map(({ id, date }) => {
            const shotgun = { guestId: id, date };
            return {
              where: { guestId_mealId: { guestId: id, mealId: meal.id } },
              create: shotgun,
              update: shotgun,
            };
          }),
        },
      },
    });
    return buildSharedMeal(saved);
  }

  async close(meal: PastSharedMealBuilder): Promise<PastSharedMeal> {
    await this.prisma.sharedMeal.update({
      where: { id: meal.id },
      data: { amount: meal.expense.amount, payedAt: meal.expense.date },
      select: { id: true },
    });
    return meal;
  }

  async list(): Promise<SharedMeal[]> {
    const meals = await this.prisma.sharedMeal.findMany({
      select: SELECT_SHARED_MEAL,
      orderBy: { id: "desc" },
    });
    return meals.map(buildSharedMeal);
  }
}

type DatabaseAdherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
};

type DatabaseSharedMeal = {
  id: number;
  menu: string;
  date: string;
  chef: DatabaseAdherent;
  amount?: number;
  payedAt?: Date;
  shotguns: {
    date: Date;
    guest: DatabaseAdherent;
  }[];
};

function buildSharedMeal(saved: DatabaseSharedMeal) {
  const builder = convertToBuilder(saved);
  if (hasExpense(builder)) {
    return PastSharedMealBuilder.build(builder);
  }
  return OnGoingSharedMealBuilder.build(builder);
}

function convertToBuilder(saved: DatabaseSharedMeal) {
  const { amount, payedAt } = saved;
  const name = nicknameOrName(saved.chef);
  const chef = { id: saved.chef.id, name };
  const meal = { menu: saved.menu, date: saved.date };
  const shotguns = saved.shotguns.map((shotgun) => ({
    id: shotgun.guest.id,
    name: nicknameOrName(shotgun.guest),
    date: shotgun.date,
  }));

  const baseBuilder = { id: saved.id, meal, chef, shotguns };

  if (!amount || !payedAt) return baseBuilder;

  return { ...baseBuilder, expense: { amount, date: payedAt } };
}

type BuildSharedMeal = ReturnType<typeof convertToBuilder>;

function hasExpense(
  builder: BuildSharedMeal,
): builder is Extract<BuildSharedMeal, { expense: Expense }> {
  return Object.hasOwn(builder, "expense");
}
