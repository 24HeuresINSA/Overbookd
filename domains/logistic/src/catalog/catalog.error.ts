import { LogisticError } from "../logistic.error.js";

export class GearAlreadyExists extends LogisticError {
  constructor(gearName: string) {
    super(`Le matos "${gearName}" existe déjà`);
  }
}

export class GearHasLinkedItems extends LogisticError {
  constructor(linkedItems: string[]) {
    super(
      `Impossible de supprimer le matériel, il est lié à : ${linkedItems.join(", ")}`,
    );
  }
}

export class CategoryAlreadyExists extends LogisticError {
  constructor(categoryName: string) {
    super(`La catégorie "${categoryName}" existe déjà`);
  }
}

export class CategoryNotFound extends LogisticError {
  constructor(id: number) {
    super(`La catégorie #${id} n'existe pas`);
  }
}
