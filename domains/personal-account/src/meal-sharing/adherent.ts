import { updateItemToList } from "@overbookd/list";

export type Adherent = {
  id: number;
  name: string;
};
export type Shotgun = Adherent & {
  date: Date;
  portion: number;
};
export class Shotguns {
  private constructor(private readonly shotguns: Shotgun[]) {}

  static init(): Shotguns {
    return new Shotguns([]);
  }

  static build(shotguns: Shotgun[]): Shotguns {
    return new Shotguns(shotguns);
  }

  addFor(adherent: Adherent): Shotguns {
    const shotgunIndex = this.shotguns.findIndex((s) => s.id === adherent.id);
    if (shotgunIndex !== -1) {
      const existingShotgun = this.shotguns[shotgunIndex];
      const updatedShotgun = {
        ...existingShotgun,
        portion: existingShotgun.portion + 1,
      };
      return new Shotguns(
        updateItemToList(this.shotguns, shotgunIndex, updatedShotgun),
      );
    }
    const shotgun = {
      ...adherent,
      date: new Date(),
      portion: 1,
    };
    return new Shotguns([...this.shotguns, shotgun]);
  }

  remove(guest: number): Shotguns {
    return new Shotguns(this.shotguns.filter(({ id }) => id !== guest));
  }

  get all(): Shotgun[] {
    return this.shotguns;
  }

  get portionCount(): number {
    return this.shotguns.reduce((total, { portion }) => total + portion, 0);
  }
}
