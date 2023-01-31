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
import { Task as TaskModel, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<TaskModel[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<TaskModel> {
    return this.tasksService.getTaskById({ id }, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<TaskModel> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<TaskModel> {
    return this.tasksService.deleteTaskById({ id }, user);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() patchTaskDto: PatchTaskDto,
    @GetUser() user: User,
  ): Promise<TaskModel> {
    return this.tasksService.updateTask(
      { where: { id }, data: patchTaskDto },
      user,
    );
  }
}
