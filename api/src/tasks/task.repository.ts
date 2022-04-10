import {EntityRepository, Repository} from "typeorm";
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {UserEntity} from "../auth/user.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('taskEntity');

        query.where('task.userId = :userId', {userId: user.id});

        if (status) {
            query.andWhere('taskEntity.status = :status', {status})
        }

        if (search) {
            query.andWhere('(LOWER(taskEntity.title) LIKE LOWER(:search) OR LOWER(taskEntity.description) LIKE LOWER(:search))',
                {search: `%${search}%`})
        }
        try {
            return await query.getMany()
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const {title, description} = createTaskDto;

        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to create task for user "${user.username}". Filters: ${JSON.stringify(createTaskDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
        delete task.user;
        return task;
    }
}