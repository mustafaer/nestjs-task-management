import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(body: Task): Task {
    const task: Task = { ...body, id: uuidv4(), status: TaskStatus.OPEN };
    this.tasks.push(task);
    return task;
  }
}
