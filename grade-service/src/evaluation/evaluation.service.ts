import { Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { InjectRepository } from '@nestjs/typeorm'; // Importamos InjectRepository
import { Repository } from 'typeorm'; // Importamos Repository
import { Evaluation } from './entities/evaluation.entity'; // Importamos la entidad Evaluation

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation) // Inyectamos el repositorio de la entidad Evaluation
    private evaluationRepository: Repository<Evaluation>,
  ) {}

  /**
   * @method Create_Evaluation
   * @description Crea una nueva evaluación en el sistema y la guarda en la base de datos.
   * @param createEvaluationDto Los datos para crear la evaluación.
   * @returns La evaluación creada y guardada en la base de datos.
   */
  async Create_Evaluation(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    const newEvaluation = this.evaluationRepository.create(createEvaluationDto); // Crea una nueva instancia de Evaluation
    return await this.evaluationRepository.save(newEvaluation); // Guarda la evaluación en la base de datos
  }
}
