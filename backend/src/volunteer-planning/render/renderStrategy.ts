import { EventAttributes, createEvents } from 'ics';

import { Assignment, Task } from '../domain/task.model';
import { formatDateWithHoursAndMinutesOnly, toDateArray } from 'src/utils/date';
import { Period } from 'src/volunteer-availability/domain/period.model';

export const JsonType = 'application/json';
export const IcalType = 'text/calendar';

type PlanningAcceptType = typeof JsonType | typeof IcalType;

function isPlanningAcceptType(
  format: string | PlanningAcceptType,
): format is PlanningAcceptType {
  return format === JsonType || format === IcalType;
}

export class PlanningRenderStrategy {
  static get(format: string): RenderStrategy {
    if (!isPlanningAcceptType(format)) return new JsonRenderStrategy();
    if (format === IcalType) return new IcalRenderStrategy();
    return new JsonRenderStrategy();
  }
}

interface RenderStrategy {
  render(tasks: Task[]): Promise<any>;
}

class JsonRenderStrategy implements RenderStrategy {
  render(tasks: Task[]) {
    return Promise.resolve(tasks);
  }
}

class IcalRenderStrategy implements RenderStrategy {
  render(tasks: Task[]) {
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
    const header = '<h2>Affectés avec toi</h2>';
    const listing = assignments.reduce((description, assignment) => {
      const volunteers = this.generateVolunteerList(assignment);
      const period = this.generatePeriodHeader(assignment.period);
      return `${description}<li>${period}<ul>${volunteers}</ul></li>`;
    }, '');

    return `${header}<ul>${listing}</ul>`;
  }

  private generatePeriodHeader(period: Period) {
    const start = formatDateWithHoursAndMinutesOnly(period.start);
    const end = formatDateWithHoursAndMinutesOnly(period.end);

    return `<h3>${start} - ${end}</h3>`;
  }

  private generateVolunteerList(assignment: Assignment) {
    return assignment.volunteers.map(({ name }) => `<li>${name}</li>`).join('');
  }
}
