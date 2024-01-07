import { Module } from "@nestjs/common";
import { SharedMealController } from "./shared-meal.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaMeals } from "./repository/meals.prisma";
import { SharedMealService } from "./shared-meal.service";
import { MealSharing } from "@overbookd/personal-account";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";

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
      inject: [PrismaMeals, PrismaAdherents],
    },
    {
      provide: SharedMealService,
      useFactory: (
        mealSharing: MealSharing,
        eventStore: DomainEventService,
      ) => {
        return new SharedMealService(mealSharing, eventStore);
      },
      inject: [MealSharing, DomainEventService],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
  exports: [SharedMealService],
})
export class SharedMealModule {}
