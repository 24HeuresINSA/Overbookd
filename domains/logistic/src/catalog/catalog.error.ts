import { LogisticError } from "../logistic.error.js";

export class GearAlreadyExists extends LogisticError {
  constructor(gearName: string) {
    super(`Le matos "${gearName}" existe déjà`);
  }
}

export class CategoryAlreadyExists extends LogisticError {
  constructor(categoryName: string) {
    super(`La catégorie "${categoryName}" existe déjà`);
  }
}

export class CategoryNotFoundException extends LogisticError {
  constructor(id: number) {
    super(`La catégorie #${id} n'existe pas`);
  }
}
