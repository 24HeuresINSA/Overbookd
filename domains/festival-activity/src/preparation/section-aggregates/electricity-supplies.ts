import {
  ElectricitySupplyAlreadyExists,
  ElectricitySupplyNotFound,
} from "../../festival-activity.error";
import {
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
} from "../prepare-festival-activity.model";
import {
  ElectricityConnection,
  ElectricitySupply
} from "../../sections/supply";
import { updateItemToList } from "@overbookd/list";
import { SlugifyService } from "@overbookd/slugify";

export class ElectricitySupplies {
  private constructor(
    private readonly electricitySupplies: ElectricitySupply[],
  ) {}

  get entries(): ElectricitySupply[] {
    return this.electricitySupplies;
  }

  static build(supplies: ElectricitySupply[]): ElectricitySupplies {
    return new ElectricitySupplies(supplies);
  }

  add(form: PrepareElectricitySupplyCreation): ElectricitySupplies {
    const id = this.generateElectricitySupplyId(form.device, form.connection);
    const comment = form.comment ?? null;
    const supply = { ...form, id, comment };

    this.throwIfAlreadyExists(id);

    return new ElectricitySupplies([...this.electricitySupplies, supply]);
  }

  update(form: PrepareElectricitySupplyUpdate): ElectricitySupplies {
    const currentSupplyIndex = this.electricitySupplies.findIndex(
      (es) => es.id === form.id,
    );
    const currentSupply = this.electricitySupplies.at(currentSupplyIndex);
    if (currentSupplyIndex === -1 || !currentSupply) {
      throw new ElectricitySupplyNotFound();
    }

    const updatedSupply = this.generateUpdatedSupply(currentSupply, form);

    if (currentSupply.id !== updatedSupply.id) {
      this.throwIfAlreadyExists(updatedSupply.id);
    }

    const electricitySupplies = updateItemToList(
      this.electricitySupplies,
      currentSupplyIndex,
      updatedSupply,
    );
    return new ElectricitySupplies(electricitySupplies);
  }

  remove(id: ElectricitySupply["id"]): ElectricitySupplies {
    return new ElectricitySupplies(
      this.electricitySupplies.filter((es) => es.id !== id),
    );
  }

  private generateElectricitySupplyId(
    device: string,
    connection: ElectricityConnection,
  ): ElectricitySupply["id"] {
    const supplyId = SlugifyService.apply(`${device} ${connection}`);
    return supplyId;
  }

  private throwIfAlreadyExists(id: string) {
    const alreadyExists = this.electricitySupplies.some((es) => es.id === id);
    if (alreadyExists) throw new ElectricitySupplyAlreadyExists();
  }

  private generateUpdatedSupply(
    previousSupply: ElectricitySupply,
    form: PrepareElectricitySupplyUpdate,
  ): ElectricitySupply {
    const updatedSupply = {
      ...previousSupply,
      connection: form.connection ?? previousSupply.connection,
      device: form.device ?? previousSupply.device,
      power: form.power ?? previousSupply.power,
      count: form.count ?? previousSupply.count,
      comment:
        form.comment === undefined ? previousSupply.comment : form.comment,
    };

    const id = this.generateElectricitySupplyId(
      updatedSupply.device,
      updatedSupply.connection,
    );

    return { ...updatedSupply, id };
  }
}
