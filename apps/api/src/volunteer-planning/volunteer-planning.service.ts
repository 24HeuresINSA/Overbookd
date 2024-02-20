import { Inject, Injectable } from "@nestjs/common";
import { Planning, TaskRepository } from "./domain/planning";
import { Task } from "./domain/task.model";
import { PlanningTask } from "@overbookd/http";

@Injectable()
export class VolunteerPlanningService {
  private planning: Planning;
  constructor(@Inject("TASK_REPOSITORY") taskRepository: TaskRepository) {
    this.planning = new Planning(taskRepository);
  }

  getVolunteerPlanning(volunteerId: number): Promise<Task[]> {
    return this.planning.generateForVolunteer(volunteerId);
  }

  getVolunteerTasks(volunteerId: number): Promise<PlanningTask[]> {
    return this.planning.listVolunteerTasks(volunteerId);
  }
}
