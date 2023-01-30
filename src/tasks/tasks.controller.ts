import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PatchTaskDto } from './dto/patch-task-dto';
import { TasksService } from './tasks.service';
import { Task as TaskModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<TaskModel[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.getTaskById({ id });
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskModel> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.deleteTaskById({ id });
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() patchTaskDto: PatchTaskDto,
  ): Promise<TaskModel> {
    return this.tasksService.updateTask({ where: { id }, data: patchTaskDto });
  }
}
