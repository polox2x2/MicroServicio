import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { CourseModule } from './course/course.module';
import { TeacherAssignmentModule } from './teacher-assignment/teacher-assignment.module';
import { CourseSeedModule } from './seed/course/course.seed.module';

import { Course } from './course/entities/course.entity';
import { TeacherAssignment } from './teacher-assignment/entities/teacher-assignment.entity';
import { AppController } from './app.controller';
import { TeacherAssignmentSeedModule } from './seed/teacher/teacher-assignment.seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Course, TeacherAssignment],
        synchronize: true,
      }),
    }),
    CourseModule,
    TeacherAssignmentModule,
    CourseSeedModule,
    TeacherAssignmentSeedModule, 
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

