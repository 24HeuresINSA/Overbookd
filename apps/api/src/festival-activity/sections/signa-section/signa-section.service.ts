import { Injectable, NotFoundException } from "@nestjs/common";
import {
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareSignageCreation,
  Signage,
  SignageCatalogItem,
  signa,
} from "@overbookd/festival-event";
import { PrepareSignaForm } from "@overbookd/http";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
import { TeamService } from "../../../team/team.service";
import {
  CatalogSignages,
  Locations,
} from "../../common/festival-activity-common.model";
import { UpdateSignageRequest } from "./dto/update-signage.request.dto";

type LinkSignageToCatalogItem = {
  activityId: FestivalActivity["id"];
  signageId: Signage["id"];
  catalogItemId: SignageCatalogItem["id"];
};

@Injectable()
export class SignaSectionService {
  constructor(
    private readonly locations: Locations,
    private readonly prepare: PrepareFestivalActivity,
    private readonly catalogSignages: CatalogSignages,
  ) {}

  async saveSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const location = signa.locationId
      ? await this.locations.find(signa.locationId)
      : null;

    return this.prepare.updateSignaSection(id, { location });
  }

  addSignage(
    id: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ): Promise<FestivalActivity> {
    return this.prepare.addSignage(id, signage);
  }

  updateSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
    signageUpdate: UpdateSignageRequest,
  ): Promise<FestivalActivity> {
    const signage = { id: signageId, ...signageUpdate };
    return this.prepare.updateSignage(faId, signage);
  }

  removeSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeSignage(faId, signageId);
  }

  async linkSignageToCatalogItem(
    user: JwtUtil,
    { activityId, signageId, catalogItemId }: LinkSignageToCatalogItem,
  ): Promise<FestivalActivity> {
    const catalogItem = await this.catalogSignages.find(catalogItemId);
    if (!catalogItem) {
      throw new NotFoundException(
        "❌ La signalétique n'existe pas dans le catalogue",
      );
    }

    TeamService.checkMembership(user, signa);

    return this.prepare.linkSignageToCatalogItem(activityId, {
      signageId,
      catalogItem,
    });
  }
}
