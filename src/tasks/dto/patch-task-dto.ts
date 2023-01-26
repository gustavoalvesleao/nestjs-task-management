import { TaskStatus } from '../task.model';

export class PatchTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
