import { Injectable } from "@nestjs/common";
import {
  ElectricitySupply,
  FestivalActivity,
  PrepareElectricitySupplyCreation,
  PrepareFestivalActivity,
  PrepareSupplyUpdate,
} from "@overbookd/festival-event";
import { UpdateElectricitySupplyRequest } from "./dto/update-electricity-supply.request.dto";

@Injectable()
export class SupplySectionService {
  constructor(private readonly prepare: PrepareFestivalActivity) {}

  saveSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    return this.prepare.updateSupplySection(id, supply);
  }

  addElectricitySupply(
    id: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addElectricitySupply(id, electricitySupply);
  }

  updateElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
    electricitySupplyUpdate: UpdateElectricitySupplyRequest,
  ): Promise<FestivalActivity> {
    const electricitySupply = {
      id: electricitySupplyId,
      ...electricitySupplyUpdate,
    };
    return this.prepare.updateElectricitySupply(faId, electricitySupply);
  }

  removeElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeElectricitySupply(faId, electricitySupplyId);
  }
}
