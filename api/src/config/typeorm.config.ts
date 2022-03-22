import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mustafaer',
    password: 'q',
    database: 'task-management',
    entities: [__dirname + '/../**/*.entity.ts'],
    synchronize: true,
}