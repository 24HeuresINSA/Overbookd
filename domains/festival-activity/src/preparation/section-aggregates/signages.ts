import { SlugifyService } from "@overbookd/slugify";
import { Signage } from "../../sections/signa";
import {
  FestivalActivityError,
  SignageAlreadyExists,
  SignageNotFound,
} from "../../festival-activity.error";
import {
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "../prepare-festival-activity.model";
import { updateItemToList } from "@overbookd/list";

export class LocationIsRequired extends FestivalActivityError {
  constructor() {
    super("Le lieux ne peut pas etre remis a zero");
  }
}

export class Signages {
  private constructor(private readonly signages: Signage[]) {}

  get entries(): Signage[] {
    return this.signages;
  }

  static build(signages: Signage[]): Signages {
    return new Signages(signages);
  }

  add(form: PrepareSignageCreation): Signages {
    const id = this.generateSignageId(form.type, form.text, form.size);
    const signage = {
      ...form,
      id,
      comment: form.comment ?? null,
    };

    this.throwIfAlreadyExists(id);

    return new Signages([...this.signages, signage]);
  }

  update(form: PrepareSignageUpdate): Signages {
    const currentSignageIndex = this.signages.findIndex(
      (signage) => signage.id === form.id,
    );
    const currentSignage = this.signages.at(currentSignageIndex);
    if (currentSignageIndex === -1 || !currentSignage) {
      throw new SignageNotFound();
    }

    const updatedSignage = this.generateUpdatedSignage(currentSignage, form);
    if (updatedSignage.id !== currentSignage.id) {
      this.throwIfAlreadyExists(updatedSignage.id);
    }

    const signages = updateItemToList(
      this.signages,
      currentSignageIndex,
      updatedSignage,
    );
    return new Signages(signages);
  }

  remove(id: Signage["id"]): Signages {
    return new Signages(this.signages.filter((s) => s.id !== id));
  }

  private generateUpdatedSignage(
    previousSignage: Signage,
    form: PrepareSignageUpdate,
  ): Signage {
    const updatedSignage = {
      ...previousSignage,
      text: form.text ?? previousSignage.text,
      quantity: form.quantity ?? previousSignage.quantity,
      size: form.size ?? previousSignage.size,
      type: form.type ?? previousSignage.type,
      comment:
        form.comment === undefined ? previousSignage.comment : form.comment,
    };

    const id = this.generateSignageId(
      updatedSignage.type,
      updatedSignage.text,
      updatedSignage.size,
    );

    return { ...updatedSignage, id };
  }

  private generateSignageId(
    type: Signage["type"],
    text: Signage["text"],
    size: Signage["size"],
  ): string {
    return SlugifyService.apply(`${type} ${text} ${size}`);
  }

  private throwIfAlreadyExists(id: string) {
    const alreadyExists = this.signages.some((signage) => signage.id === id);
    if (alreadyExists) throw new SignageAlreadyExists();
  }
}
