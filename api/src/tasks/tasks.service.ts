import {Injectable, NotFoundException} from '@nestjs/common';
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository,) {
    }

    async getAllTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
        return await this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
