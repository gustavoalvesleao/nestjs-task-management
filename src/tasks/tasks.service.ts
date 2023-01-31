import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { PatchTaskDto } from './dto/patch-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Task, User } from '@prisma/client';
import { TaskStatus } from './types';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    if (!status && !search)
      return this.prisma.task.findMany({
        where: {
          userId: { equals: user.id },
        },
      });

    return this.prisma.task.findMany({
      where: {
        OR: [
          { description: { contains: search } },
          { title: { contains: search } },
          { status: { equals: status } },
        ],
        AND: { userId: { equals: user.id } },
      },
    });
  }

  async getTaskById(
    where: Prisma.TaskWhereUniqueInput,
    user: User,
  ): Promise<Task> {
    const [task] = await this.prisma.task.findMany({
      where: {
        id: where.id,
        userId: user.id,
      },
    });

    if (!task)
      throw new NotFoundException(`Task with id ${where.id} not found`);

    return task;
  }

  async createTask(task: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = task;

    return this.prisma.task.create({
      data: {
        title,
        description,
        status: TaskStatus.OPEN,
        userId: user.id,
      },
    });
  }

  async deleteTaskById(
    where: Prisma.TaskWhereUniqueInput,
    user: User,
  ): Promise<Task> {
    await this.getTaskById(where, user);

    return this.prisma.task.delete({
      where,
    });
  }

  async updateTask(
    params: {
      where: Prisma.TaskWhereUniqueInput;
      data: PatchTaskDto;
    },
    user: User,
  ): Promise<Task> {
    const { data, where } = params;

    await this.getTaskById(where, user);

    return this.prisma.task.update({
      where,
      data,
    });
  }
}
