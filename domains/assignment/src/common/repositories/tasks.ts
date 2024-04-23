import { Task } from "../../assign-task-to-volunteer/task";
import { TaskIdentifier } from "../task";

export type Tasks = {
  findAll(): Promise<Task[]>;
  findOne(id: TaskIdentifier["id"]): Promise<Task>;
};
