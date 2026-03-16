import { ICAL, JSON, PDF } from "@overbookd/http";
import { Task, Volunteer } from "../domain/task.model";
import { IcalRenderStrategy } from "./ical-render-strategy";
import { JsonRenderStrategy } from "./json-render-strategy";
import { PdfRenderStrategy } from "./pdf-render-strategy";
import { PlanningVolunteers } from "../planning.service";

type PlanningAcceptType = typeof JSON | typeof ICAL | typeof PDF;

function isPlanningAcceptType(
  format: string | PlanningAcceptType,
): format is PlanningAcceptType {
  return format === JSON || format === ICAL || format === PDF;
}

export class PlanningRenderStrategy {
  constructor(private readonly volunteers: PlanningVolunteers) {}

  get(format: string): RenderStrategy {
    if (!isPlanningAcceptType(format)) return new JsonRenderStrategy();
    if (format === ICAL) return new IcalRenderStrategy();
    if (format === PDF) return new PdfRenderStrategy(this.volunteers);
    return new JsonRenderStrategy();
  }
}

export type RenderStrategy = {
  render(tasks: Task[], volunteerId?: Volunteer["id"]): Promise<unknown>;
};
