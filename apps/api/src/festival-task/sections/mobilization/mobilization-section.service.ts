import { Injectable } from "@nestjs/common";
import {
  FestivalTask,
  Mobilization,
  PrepareFestivalTask,
  TeamMobilization,
  UpdateMobilization,
  Volunteer,
} from "@overbookd/festival-event";
import { Adherents } from "../../common/festival-task-common.model";
import { AddMobilizationForm } from "@overbookd/http";

@Injectable()
export class MobilizationSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly adherents: Adherents,
  ) {}

  async add(
    id: FestivalTask["id"],
    form: AddMobilizationForm,
  ): Promise<FestivalTask> {
    const volunteers = await this.adherents.findMatching(form.volunteers);
    const mobilization = { ...form, volunteers };

    return this.prepare.addMobilization(id, mobilization);
  }

  update(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    mobilization: UpdateMobilization,
  ): Promise<FestivalTask> {
    return this.prepare.updateMobilization(ftId, mobilizationId, mobilization);
  }

  remove(
    id: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
  ): Promise<FestivalTask> {
    return this.prepare.removeMobilization(id, mobilizationId);
  }

  addTeam(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ): Promise<FestivalTask> {
    return this.prepare.addTeamToMobilization(ftId, mobilizationId, team);
  }

  removeTeam(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    team: string,
  ): Promise<FestivalTask> {
    return this.prepare.removeTeamFromMobilization(ftId, mobilizationId, team);
  }

  async addVolunteer(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    const adherent = await this.adherents.findOne(volunteerId);
    return this.prepare.addVolunteerToMobilization(
      ftId,
      mobilizationId,
      adherent,
    );
  }

  async removeVolunteer(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    return this.prepare.removeVolunteerFromMobilization(
      ftId,
      mobilizationId,
      volunteerId,
    );
  }
}
