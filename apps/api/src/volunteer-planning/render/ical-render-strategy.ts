import { EventAttributes, createEvents } from "ics";
import { IProvidePeriod } from "@overbookd/period";
import {
  formatDateWithHoursAndMinutesOnly,
  toDateArray,
} from "../../utils/date";
import { Assignment, Task } from "../domain/task.model";
import { RenderStrategy } from "./render-strategy";

export class IcalRenderStrategy implements RenderStrategy {
  private readonly EMPTY_CALENDAR =
    "CALSCALE:GREGORIAN\nPRODID:adamgibbons/ics\nMETHOD:PUBLISH\nX-WR-CALNAME:24 Heures de l'INSA - 48e\nX-PUBLISHED-TTL:PT1H\nEND:VCALENDAR";

  render(tasks: Task[]) {
    if (tasks.length === 0) {
      return Promise.resolve(this.EMPTY_CALENDAR);
    }
    return new Promise((res, rej) => {
      const events = tasks.map((task) => this.buildIcalEvent(task));
      createEvents(events, (error, value) => {
        if (error) rej(error);
        res(value);
      });
    });
  }

  private buildIcalEvent(task: Task): EventAttributes {
    const start = toDateArray(task.period.start);
    const end = toDateArray(task.period.end);
    const assignments = this.buildAssignmentsDescription(task.assignments);
    const description = `${task.description}${assignments}`;

    return {
      start,
      end,
      title: task.name,
      location: task.location,
      calName: "24 Heures de l'INSA - 48e",
      description,
    };
  }

  private buildAssignmentsDescription(assignments: Assignment[]) {
    if (assignments.length === 0) return "";

    const header = "<h2>Affectés avec toi</h2>";
    const listing = assignments.reduce((description, assignment) => {
      const volunteers = this.generateVolunteerList(assignment);
      const period = this.generatePeriodHeader(assignment.period);
      return `${description}<li>${period}<ul>${volunteers}</ul></li>`;
    }, "");

    return `${header}<ul>${listing}</ul>`;
  }

  private generatePeriodHeader(period: IProvidePeriod) {
    const start = formatDateWithHoursAndMinutesOnly(period.start);
    const end = formatDateWithHoursAndMinutesOnly(period.end);

    return `<h3>${start} - ${end}</h3>`;
  }

  private generateVolunteerList(assignment: Assignment) {
    return assignment.volunteers.map(({ name }) => `<li>${name}</li>`).join("");
  }
}
