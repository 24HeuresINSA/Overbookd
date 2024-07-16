import { Field } from "./field.js";

export class EULAField implements Field<boolean> {
  private constructor(private readonly hasApprovedEULA: boolean) {}

  get value(): boolean {
    return this.hasApprovedEULA;
  }

  get isValid(): boolean {
    return this.hasApprovedEULA === true;
  }

  get reasons(): string[] {
    return this.isValid
      ? []
      : ["Les Condidtions Générales d'Utilisation doivent être approuvées"];
  }

  static build(hasApprovedEULA?: boolean): EULAField {
    return new EULAField(hasApprovedEULA ?? false);
  }
}
