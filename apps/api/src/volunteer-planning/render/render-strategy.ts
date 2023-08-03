import { Task, Volunteer } from '../domain/task.model';
import { IcalRenderStrategy } from './ical-render-strategy';
import { JsonRenderStrategy } from './json-render-strategy';
import { PdfRenderStrategy } from './pdf-render-strategy';

export const JsonType = 'application/json';
export const IcalType = 'text/calendar';
export const PdfType = 'application/pdf';

type PlanningAcceptType = typeof JsonType | typeof IcalType | typeof PdfType;

function isPlanningAcceptType(
  format: string | PlanningAcceptType,
): format is PlanningAcceptType {
  return format === JsonType || format === IcalType || format === PdfType;
}

export class PlanningRenderStrategy {
  static get(format: string): RenderStrategy {
    if (!isPlanningAcceptType(format)) return new JsonRenderStrategy();
    if (format === IcalType) return new IcalRenderStrategy();
    if (format === PdfType) return new PdfRenderStrategy();
    return new JsonRenderStrategy();
  }
}

export interface RenderStrategy {
  render(tasks: Task[], volunteer?: Volunteer): Promise<any>;
}
