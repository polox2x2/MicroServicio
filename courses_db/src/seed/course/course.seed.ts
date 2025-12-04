import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CourseSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async onModuleInit() {
    const count = await this.courseRepo.count();
    if (count > 0) {
      return;
    }

    const initialCourses = [
      {
        name: 'Introducción a la Programación',
        code: 'CS101',
        description: 'Fundamentos de programación en un lenguaje moderno.',
        credits: 4,
        semester: '2025-I',
      },
      {
        name: 'Estructuras de Datos',
        code: 'CS201',
        description: 'Listas, colas, pilas, árboles y algoritmos de ordenamiento.',
        credits: 4,
        semester: '2025-I',
      },
      {
        name: 'Bases de Datos',
        code: 'CS301',
        description: 'Modelado, SQL avanzado y transacciones.',
        credits: 3,
        semester: '2025-II',
      },
      {
        name: 'Arquitectura de Software',
        code: 'CS401',
        description: 'Patrones, microservicios y buenas prácticas.',
        credits: 3,
        semester: '2025-II',
      },
      {
        name: 'Redes y Comunicaciones',
        code: 'NT101',
        description: 'Protocolos, topologías y servicios de red.',
        credits: 3,
        semester: '2025-I',
      },
    ];

    const entities = initialCourses.map(c =>
      this.courseRepo.create(c as Partial<Course>),
    );

    await this.courseRepo.save(entities);

    console.log('🌱 Datos iniciales insertados en Course');
  }
}
