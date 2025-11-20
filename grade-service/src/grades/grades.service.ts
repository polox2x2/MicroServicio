import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { InjectRepository } from '@nestjs/typeorm'; // Importamos InjectRepository
import { Repository } from 'typeorm'; // Importamos Repository
import { Grade } from './entities/grade.entity'; // Importamos la entidad Grade

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade) // Inyectamos el repositorio de la entidad Grade
    private gradeRepository: Repository<Grade>,
  ) {}

  /**
   * @method Create_Grade
   * @description Crea una nueva nota en el sistema y la guarda en la base de datos.
   * @param createGradeDto Los datos para crear la nota.
   * @returns La nota creada y guardada en la base de datos.
   */
  async Create_Grade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const newGrade = this.gradeRepository.create(createGradeDto); // Crea una nueva instancia de Grade
    return await this.gradeRepository.save(newGrade); // Guarda la nota en la base de datos
  }
}
