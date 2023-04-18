import { createEvents, DateArray } from 'ics';

import { Task } from '../domain/task.model';
import { formatDateWithHoursAndMinutesOnly } from 'src/utils/date';

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
      const events = tasks.map((task) => {
        const start: DateArray = [
          task.period.start.getFullYear(),
          task.period.start.getMonth() + 1,
          task.period.start.getDate(),
          task.period.start.getHours(),
          task.period.start.getMinutes(),
        ];
        const end: DateArray = [
          task.period.end.getFullYear(),
          task.period.end.getMonth() + 1,
          task.period.end.getDate(),
          task.period.end.getHours(),
          task.period.end.getMinutes(),
        ];
        const assignmentsDescription = task.assignments.reduce(
          (description, assignment) => {
            const volunteers = assignment.volunteers
              .map(({ name }) => `<li>${name}</li>`)
              .join('');
            const period = `${formatDateWithHoursAndMinutesOnly(
              assignment.period.start,
            )} - ${formatDateWithHoursAndMinutesOnly(assignment.period.end)}`;
            return `${description}\n<li>${period}<ul>${volunteers}</ul></li>`;
          },
          '<h2>Affectés avec toi</h2><ul>',
        );
        const description = `${task.description}\n\n${assignmentsDescription}</ul>`;
        return {
          start,
          end,
          title: task.name,
          location: task.location,
          calName: "24 Heures de l'INSA - 48e",
          description,
        };
      });
      createEvents(events, (error, value) => {
        if (error) rej(error);
        res(value);
      });
    });
  }
}
