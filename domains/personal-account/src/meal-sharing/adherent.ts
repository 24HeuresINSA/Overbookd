export type Adherent = {
  id: number;
  name: string;
};
export type Shotgun = Adherent & {
  date: Date;
};
export class Shotguns {
  private constructor(private readonly shotguns: Shotgun[]) {}

  static init(): Shotguns {
    return new Shotguns([]);
  }

  static build(shotguns: Shotgun[]): Shotguns {
    return new Shotguns(shotguns);
  }

  add(shotgun: Shotgun): Shotguns {
    return new Shotguns([...this.shotguns, shotgun]);
  }

  get all(): Shotgun[] {
    return this.shotguns;
  }

  before(payment: Date): Shotgun[] {
    return this.shotguns.filter(
      ({ date }) => date.getTime() < payment.getTime(),
    );
  }
}
