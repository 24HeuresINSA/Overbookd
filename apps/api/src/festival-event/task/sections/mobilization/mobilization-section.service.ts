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
import { JwtPayload } from "../../../../authentication/entities/jwt-util.entity";

@Injectable()
export class MobilizationSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly adherents: Adherents,
  ) {}

  async add(
    id: FestivalTask["id"],
    form: AddMobilizationForm,
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const [instigator, volunteers] = await Promise.all([
      this.adherents.findOne(user.id),
      this.adherents.findMatching(form.volunteers),
    ]);
    const mobilization = { ...form, volunteers };

    return this.prepare.addMobilization(id, mobilization, instigator);
  }

  async update(
    ftId: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    mobilization: UpdateMobilization,
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const instigator = await this.adherents.findOne(user.id);
    return this.prepare.updateMobilization(
      ftId,
      mobilizationId,
      mobilization,
      instigator,
    );
  }

  async remove(
    id: FestivalTask["id"],
    mobilizationId: Mobilization["id"],
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const instigator = await this.adherents.findOne(user.id);
    return this.prepare.removeMobilization(id, mobilizationId, instigator);
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

  removeVolunteer(
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
