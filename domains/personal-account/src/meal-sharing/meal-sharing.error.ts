export class MealSharingError extends Error {}

export class ChefNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Can't find chef with id ${id}`);
  }
}
export class MealNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Can't find meal with id ${id}`);
  }
}
export class GuestNotFound extends MealSharingError {
  constructor(id: number) {
    super(`Can't find guest with id ${id}`);
  }
}
