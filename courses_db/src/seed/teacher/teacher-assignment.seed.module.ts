import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAssignment } from '../../teacher-assignment/entities/teacher-assignment.entity';
import { TeacherAssignmentSeed } from './teacher-assignment.seed';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherAssignment])],
  providers: [TeacherAssignmentSeed],
})
export class TeacherAssignmentSeedModule {}
