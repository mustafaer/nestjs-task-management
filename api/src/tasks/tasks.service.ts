import {Injectable} from '@nestjs/common';
import {Task, TaskStatus} from './task.model';
import {v4 as uuidv4} from 'uuid';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const {status, search} = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }
        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        }
        return tasks
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const task: Task = {
            ...createTaskDto,
            id: uuidv4(),
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task: Task) => task.id === id);
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task: Task) => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
