import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { TeacherAssignmentModule } from 'src/teacher-assignment/teacher-assignment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), TeacherAssignmentModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
