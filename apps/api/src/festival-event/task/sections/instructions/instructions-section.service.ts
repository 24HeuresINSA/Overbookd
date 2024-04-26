import { Injectable } from "@nestjs/common";
import {
  Contact,
  FestivalTask,
  FestivalTaskError,
  ForceInstructions,
  PrepareFestivalTask,
  Volunteer,
  isReadyToAssign,
  ReadyToAssignWithConflicts,
} from "@overbookd/festival-event";
import { InitInChargeForm, UpdateInstructionsForm } from "@overbookd/http";
import { Adherents } from "../../common/festival-task-common.model";
import { Locations } from "../../../common/repository/locations.prisma";
import { JwtPayload } from "../../../../authentication/entities/jwt-util.entity";

@Injectable()
export class InstructionsSectionService {
  constructor(
    private readonly prepare: PrepareFestivalTask,
    private readonly locations: Locations,
    private readonly adherents: Adherents,
  ) {}

  async update(
    id: FestivalTask["id"],
    instructions: UpdateInstructionsForm,
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const instigator = await this.adherents.findOne(user.id);
    const appointment = instructions.appointmentId
      ? { appointment: await this.locations.find(instructions.appointmentId) }
      : {};

    const updateInstructions = { ...instructions, ...appointment };
    return this.prepare.updateInstructionsSection(
      id,
      updateInstructions,
      instigator,
    );
  }

  async force(
    id: FestivalTask["id"],
    instructions: ForceInstructions,
    user: JwtPayload,
  ): Promise<ReadyToAssignWithConflicts> {
    const instigator = await this.adherents.findOne(user.id);

    const task = await this.prepare.forceInstructions(
      id,
      instructions,
      instigator,
    );
    if (!isReadyToAssign(task)) {
      const error =
        "Impossible de récupérer la ft, mais la mise à jour a bien eu lieu";
      throw new FestivalTaskError(error);
    }
    return task;
  }

  async addContact(
    id: FestivalTask["id"],
    contactId: Contact["id"],
  ): Promise<FestivalTask> {
    const contact = await this.adherents.findContact(contactId);
    return this.prepare.addContact(id, contact);
  }

  async removeContact(
    id: FestivalTask["id"],
    contactId: Contact["id"],
  ): Promise<FestivalTask> {
    return this.prepare.removeContact(id, contactId);
  }

  async addInChargeVolunteer(
    id: FestivalTask["id"],
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    const contact = await this.adherents.findOne(volunteerId);
    return this.prepare.addInChargeVolunteer(id, contact);
  }

  async removeInChargeVolunteer(
    id: FestivalTask["id"],
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    return this.prepare.removeInChargeVolunteer(id, volunteerId);
  }

  async initInCharge(
    id: FestivalTask["id"],
    { volunteers, instruction }: InitInChargeForm,
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const instigator = await this.adherents.findOne(user.id);
    const form = {
      volunteers: await this.adherents.findMatching(volunteers),
      instruction,
    };
    return this.prepare.initInCharge(id, form, instigator);
  }

  async clearInCharge(
    id: FestivalTask["id"],
    user: JwtPayload,
  ): Promise<FestivalTask> {
    const instigator = await this.adherents.findOne(user.id);
    return this.prepare.clearInCharge(id, instigator);
  }
}
