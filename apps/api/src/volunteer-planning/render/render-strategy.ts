import { ICAL, JSON, PDF } from "@overbookd/http";
import { Task, Volunteer } from "../domain/task.model";
import { IcalRenderStrategy } from "./ical-render-strategy";
import { JsonRenderStrategy } from "./json-render-strategy";
import { PdfRenderStrategy } from "./pdf-render-strategy";

type PlanningAcceptType = typeof JSON | typeof ICAL | typeof PDF;

function isPlanningAcceptType(
  format: string | PlanningAcceptType,
): format is PlanningAcceptType {
  return format === JSON || format === ICAL || format === PDF;
}

export class PlanningRenderStrategy {
  static get(format: string): RenderStrategy {
    if (!isPlanningAcceptType(format)) return new JsonRenderStrategy();
    if (format === ICAL) return new IcalRenderStrategy();
    if (format === PDF) return new PdfRenderStrategy();
    return new JsonRenderStrategy();
  }
}

export type RenderStrategy = {
  render(tasks: Task[], volunteer?: Volunteer): Promise<unknown>;
};
