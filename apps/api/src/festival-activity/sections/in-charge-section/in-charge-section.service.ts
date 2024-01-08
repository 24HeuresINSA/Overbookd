import { Injectable } from "@nestjs/common";
import type {
  Contractor,
  FestivalActivity,
  PrepareContractorCreation,
} from "@overbookd/festival-activity";
import { PrepareFestivalActivity } from "@overbookd/festival-activity";
import type { PrepareInChargeForm } from "@overbookd/http";
import type { Adherents } from "../../common/festival-activity-common.model";
import type { UpdateContractorRequest } from "./dto/update-contractor.request.dto";

@Injectable()
export class InChargeSectionService {
  constructor(
    private readonly adherents: Adherents,
    private readonly prepare: PrepareFestivalActivity,
  ) {}

  async saveInChargeSection(
    id: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const adherent = inCharge.adherentId
      ? { adherent: await this.adherents.find(inCharge.adherentId) }
      : {};

    return this.prepare.updateInChargeSection(id, {
      ...inCharge,
      ...adherent,
    });
  }

  addContractor(
    id: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addContractor(id, contractor);
  }

  updateContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
    contractorUpdate: UpdateContractorRequest,
  ): Promise<FestivalActivity> {
    const contractor = { id: contractorId, ...contractorUpdate };
    return this.prepare.updateContractor(faId, contractor);
  }

  removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeContractor(faId, contractorId);
  }
}
