import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto'; // Importamos el DTO

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  /**
   * @method Create_Evaluation
   * @description Maneja las peticiones POST para crear una nueva evaluación.
   * Valida el cuerpo de la petición usando CreateEvaluationDto.
   * @param createEvaluationDto Los datos para crear la evaluación.
   * @returns El resultado de la operación de creación de la evaluación.
   */
  @Post()
  @UsePipes(new ValidationPipe()) // Aplica la validación del DTO
  Create_Evaluation(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.Create_Evaluation(createEvaluationDto);
  }
}
