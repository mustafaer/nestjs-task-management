import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {TasksService} from './tasks.service';
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {UserEntity} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorators";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController');

    constructor(private taskService: TasksService) {
    }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.taskService.getAllTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @GetUser() user: UserEntity,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<TaskEntity> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity> {
        return this.taskService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: number,
        @GetUser() user: UserEntity,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<TaskEntity> {
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
