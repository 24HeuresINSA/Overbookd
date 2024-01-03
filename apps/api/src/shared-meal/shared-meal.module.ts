import { Module } from "@nestjs/common";
import { SharedMealController } from "./shared-meal.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaMeals } from "./repository/meals.prisma";
import { SharedMealService } from "./shared-meal.service";
import { MealSharing } from "@overbookd/personal-account";

@Module({
  controllers: [SharedMealController],
  providers: [
    {
      provide: PrismaAdherents,
      useFactory: (prisma: PrismaService) => new PrismaAdherents(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaMeals,
      useFactory: (prisma: PrismaService) => new PrismaMeals(prisma),
      inject: [PrismaService],
    },
    {
      provide: MealSharing,
      useFactory: (meals: PrismaMeals, adherents: PrismaAdherents) => {
        return new MealSharing(meals, adherents);
      },
      inject: [PrismaAdherents, PrismaMeals],
    },
    {
      provide: SharedMealService,
      useFactory: (mealSharing: MealSharing) => {
        return new SharedMealService(mealSharing);
      },
      inject: [MealSharing],
    },
  ],
  imports: [PrismaModule],
  exports: [SharedMealService],
})
export class SharedMealModule {}
