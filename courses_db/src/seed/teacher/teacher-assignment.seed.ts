import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from '../../teacher-assignment/entities/teacher-assignment.entity';

@Injectable()
export class TeacherAssignmentSeed implements OnModuleInit {
  constructor(
    @InjectRepository(TeacherAssignment)
    private readonly teacherAssignmentRepo: Repository<TeacherAssignment>,
  ) {}

  async onModuleInit() {
    const count = await this.teacherAssignmentRepo.count();

    if (count > 0) {
      return;
    }

    const initialData = [
      { courseId: 1, teacherId: 101 },
      { courseId: 2, teacherId: 102 },
      { courseId: 3, teacherId: 103 },
      { courseId: 4, teacherId: 104 },
    ];

    const entities = initialData.map(item =>
      this.teacherAssignmentRepo.create(item as Partial<TeacherAssignment>),
    );

    await this.teacherAssignmentRepo.save(entities);

    console.log('🌱 Datos iniciales insertados en teacher_assignment');
  }
}
