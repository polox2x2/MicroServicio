import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async onModuleInit() {
    const count = await this.enrollmentRepo.count();

    if (count > 0) {
      return;
    }

    const initialData = [
      { studentId: 1, courseId: 10, status: 'active' },
      { studentId: 2, courseId: 11, status: 'active' },
      { studentId: 3, courseId: 12, status: 'completed' },
      { studentId: 4, courseId: 15, status: 'dropped' },
    ];

    const entities = initialData.map(d =>
      this.enrollmentRepo.create(d as Partial<Enrollment>),
    );

    await this.enrollmentRepo.save(entities);

    console.log('🌱 Datos iniciales insertados en enrollment');
  }
}
