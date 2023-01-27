import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { PatchTaskDto } from './dto/patch-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    if (!status && !search) return this.prisma.task.findMany();

    return this.prisma.task.findMany({
      where: {
        OR: [
          { description: { contains: search } },
          { title: { contains: search } },
        ],
        AND: { status: { equals: status } },
      },
    });
  }

  async getTaskById(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where,
    });

    if (!task)
      throw new NotFoundException(`Task with id ${where.id} not found`);

    return task;
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    const { title, description } = task;

    return this.prisma.task.create({
      data: {
        title,
        description,
        status: TaskStatus.OPEN,
      },
    });
  }

  async deleteTaskById(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task
      .delete({
        where,
      })
      .catch(() => {
        throw new NotFoundException(`Task with id ${where.id} not found`);
      });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: PatchTaskDto;
  }): Promise<Task> {
    const { data, where } = params;

    return this.prisma.task
      .update({
        where,
        data,
      })
      .catch(() => {
        throw new NotFoundException(`Task with id ${where.id} not found`);
      });
  }
}
