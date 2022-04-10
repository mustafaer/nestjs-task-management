import {Injectable, NotFoundException} from '@nestjs/common';
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {UserEntity} from "../auth/user.entity";

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository,) {
    }

    async getAllTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        return await this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: UserEntity): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}
