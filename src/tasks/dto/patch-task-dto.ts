import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class PatchTaskDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
