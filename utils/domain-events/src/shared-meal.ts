import type { Event } from "@overbookd/event";
import type { PastSharedMeal } from "@overbookd/personal-account";

export const SHARED_MEAL_CLOSED = "shared-meal-closed";

export type SharedMealClosed = Event<typeof SHARED_MEAL_CLOSED, PastSharedMeal>;
