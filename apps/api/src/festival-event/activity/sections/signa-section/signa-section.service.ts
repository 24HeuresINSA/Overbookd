import { Injectable, NotFoundException } from "@nestjs/common";
import {
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareSignageCreation,
  Signage,
  SignageCatalogItem,
} from "@overbookd/festival-event";
import { PrepareSignaForm } from "@overbookd/http";
import { checkMembership } from "../../../../team/team.utils";
import { CatalogSignages } from "../../common/festival-activity-common.model";
import { Locations } from "../../../common/repository/locations.prisma";
import { UpdateSignageRequest } from "./dto/update-signage.request.dto";
import { SIGNA } from "@overbookd/team-constants";
import { RequestHydratedUser } from "../../../../authentication-zitadel/request-hydrated-user";

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
    user: RequestHydratedUser,
    { activityId, signageId, catalogItemId }: LinkSignageToCatalogItem,
  ): Promise<FestivalActivity> {
    const catalogItem = await this.catalogSignages.find(catalogItemId);
    if (!catalogItem) {
      throw new NotFoundException(
        "La signalétique n'existe pas dans le catalogue",
      );
    }

    checkMembership(user, SIGNA);

    return this.prepare.linkSignageToCatalogItem(activityId, {
      signageId,
      catalogItem,
    });
  }
}
