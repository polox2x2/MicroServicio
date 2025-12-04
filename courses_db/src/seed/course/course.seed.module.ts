import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseSeed } from './course.seed';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseSeed],
})
export class CourseSeedModule {}
