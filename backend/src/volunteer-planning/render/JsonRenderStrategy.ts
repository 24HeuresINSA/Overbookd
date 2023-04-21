import { Task } from '../domain/task.model';
import { RenderStrategy } from './renderStrategy';

export class JsonRenderStrategy implements RenderStrategy {
  render(tasks: Task[]) {
    return Promise.resolve(tasks);
  }
}
