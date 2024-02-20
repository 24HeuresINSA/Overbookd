import { Injectable } from "@nestjs/common";
import {
  Contact,
  FestivalTask,
  PrepareFestivalTask,
  Volunteer,
} from "@overbookd/festival-event";
import { UpdateInstructionsForm } from "@overbookd/http";
import { Adherents } from "../../common/festival-task-common.model";
import { Locations } from "../../../common/repository/locations.prisma";

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
  ): Promise<FestivalTask> {
    const appointment = instructions.appointmentId
      ? { appointment: await this.locations.find(instructions.appointmentId) }
      : {};

    return this.prepare.updateInstructionsSection(id, {
      ...instructions,
      ...appointment,
    });
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

  async clearInCharge(id: FestivalTask["id"]): Promise<FestivalTask> {
    return this.prepare.clearInCharge(id);
  }
}
